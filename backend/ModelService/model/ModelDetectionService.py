from confluent_kafka.cimpl import Producer
from ultralytics import YOLO
import torch
from model.sort import *
from Utils import *
from confluent_kafka import Consumer, KafkaError
from kafka.kafka_config import KafkaConfig

# safety_score = ((safety_vest_people_count/(safety_vest_people_count+no_safety_vest_people_count)))*100
###############################################################################################


model = YOLO('fine_tuned_weights.pt')

## Yolo class names
className = [
    'Hardhat', 'Mask', 'NO_Hardhat', 'NO-Mask', 'NO-Safety Vest', 'Person', "Safety Cone", 'Safety Vest',
    'machinery', 'vehicle', 'person']

safety_vest_people_count = 0
no_safety_vest_people_count = 0
violation_score = 0
safety_score = 0

# Frame Counter initialized
frame_number = 0

# Violations dictionary initialized
violation_dict = {}

# violators count:
violators_count = 0

# Global file path base
output_file_base = "../resources/json/ppe/frame"

violator_ID = []

global safety_conditions
###############################################################################################

"""       UTILS         """


def raise_flag(category: str, img, event_type: str, timestamp: str, frame: str,
               location: Dict[str, int], confidence: int, employee_id: str, violation_type: str, violation_count: int,
               severity_level: str,
               metadata: Dict[str, str], output_file: str):
    print("Flag_raised")
    global violators_count
    violators_count += 1

    global violator_ID
    violator_ID.append(employee_id)

    # Calculate width and height
    x1, y1, x2, y2 = location["x1"], location["y1"], location["x2"], location["y2"]
    w = x2 - x1
    h = y2 - y1

    # Draw the rectangle on the image
    img_copy = img.copy()  # Create a copy of the original image
    img_copy = cv2.rectangle(img, (x1, y1), (x2, y2), (0, 0, 255), 5)  # Making rectangle

    # image_encoded = compress_image_to_base64(img_copy, quality=20)
    description = make_description(location, confidence, employee_id, violation_type)
    print(category)

    generate_json("Alert", safety_score, violators_count, safety_conditions, description, event_type, timestamp, frame,
                  location, confidence, employee_id, violation_type, severity_level,
                  metadata, output_file)


def anomaly_detector(img, box, x1: int, y1: int, x2: int, y2: int, Id: int, currentClass: str, conf: int):
    global current_count
    global violation_dict
    global frame_number
    global output_file_base

    if currentClass in ('NO-Safety Vest', 'NO_Hardhat', 'NO-Mask'):

        global violation_count
        print(violators_count)
        if Id not in violation_dict.keys() and Id != None:
            violation_dict[Id] = [frame_number, 1, conf]
            generate_json("Non-Alert", safety_score, violators_count, safety_conditions, " ", "PPE Violation",
                          "2024-07-01T14:23:45Z",
                          frame_number,
                          {"x1": x1, "y1": y1, "x2": x2, "y2": y2}, violation_dict[Id][2], Id, currentClass, "high",
                          {"camera_id": "CAM01", "location": "Warehouse Section A",
                           "environmental_conditions": "Normal"}, f"{output_file_base}_{frame_number}.json")

        else:

            if (violation_dict[Id][1] == -999):
                generate_json("Non-Alert", safety_score, violators_count, safety_conditions, " ", "PPE Violation",
                              "2024-07-01T14:23:45Z",
                              frame_number,
                              {"x1": x1, "y1": y1, "x2": x2, "y2": y2}, violation_dict[Id][2], Id, currentClass, "high",
                              {"camera_id": "CAM01", "location": "Warehouse Section A",
                               "environmental_conditions": "Normal"}, f"{output_file_base}_{frame_number}.json")
                # print ("\n\n PASSED")



            elif (violation_dict[Id][0] in range(frame_number - 10, frame_number + 10)):

                print("\nDICT_value : ", violation_dict[Id][1])
                print("\n")
                if (violation_dict[Id][1] == 50):
                    violation_dict[Id][1] = -999
                    # print ("\n\n ENTERED FRAME ")
                    # print (voilation_dict[1][1])
                    raise_flag(
                        category="Alert",
                        img=img,
                        event_type="PPE Violation",
                        timestamp="2024-07-01T14:23:45Z",
                        frame=frame_number,
                        location={"x1": x1, "y1": y1, "x2": x2, "y2": y2},
                        confidence=violation_dict[Id][2],
                        employee_id=Id,
                        violation_type=currentClass,
                        violation_count=violators_count,
                        severity_level="high",
                        metadata={"camera_id": "CAM01", "location": "Warehouse Section A",
                                  "environmental_conditions": "Normal"},
                        output_file=f"{output_file_base}_{frame_number}.json"
                    )


                else:
                    violation_dict[Id][0] = frame_number
                    violation_dict[Id][1] += 1
                    violation_dict[Id][2] = max(violation_dict[Id][2], conf)
                    generate_json("Non-Alert", safety_score, violators_count, safety_conditions, "", "PPE Violation",
                                  "2024-07-01T14:23:45Z", frame_number,
                                  {"x1": x1, "y1": y1, "x2": x2, "y2": y2}, violation_dict[Id][2], Id, currentClass,
                                  "high", {"camera_id": "CAM01", "location": "Warehouse Section A",
                                           "environmental_conditions": "Normal"},
                                  f"{output_file_base}_{frame_number}.json")

                    # print ("\n Frame Number", frame_number)
                    # print (voilation_dict[1][1])

            elif (violation_dict[Id][0] not in range(frame_number - 10, frame_number + 10)):
                # quit()
                violation_dict[Id][0] = frame_number
                violation_dict[Id][1] = 1
                violation_dict[Id][2] = conf
                generate_json("Non-Alert", safety_score, violators_count, safety_conditions, "", "PPE Violation",
                              "2024-07-01T14:23:45Z",
                              frame_number,
                              {"x1": x1, "y1": y1, "x2": x2, "y2": y2}, violation_dict[Id][2], Id, currentClass, "high",
                              {"camera_id": "CAM01", "location": "Warehouse Section A",
                               "environmental_conditions": "Normal"}, f"{output_file_base}_{frame_number}.json")

                # print ("\n Frame Number", frame_number)


            else:

                print("UNKNOWN VIOLATION")
                quit()

        return f"{output_file_base}_{frame_number}.json"


def object_ID(img, box, cls: int, result_tracker, current_Class: str, class_names: List, conf: int):
    """
        Function will make a rectangle against selected class and will also display the ID for tracking

    """

    for results in result_tracker:
        x1, y1, x2, y2, Id = results
        x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
        w, h = x2 - x1, y2 - y1

        cvzone.putTextRect(img, f"ID - {int(Id)}", (max(x2 - w - 10, 0), max(y2 - 10, h)), 1.5, 2)

        x_center = x1 + w // 2
        y_center = y1 + h // 2

        output_json_path = anomaly_detector(img, box, x1, y1, x2, y2, Id, current_Class, conf)
        return output_json_path


def class_to_track(img, box, cls: int, detections, current_class: str, class_names: List):
    """
        This function will make boxes and assign IDs to given classes.
        It will assign to all IDs to all detected objects if class_names is empty

        Return Type : Detections, Center x coordinate, Center y coordinate

    """
    if (current_class == 'Safety Vest'):
        global safety_vest_people_count
        safety_vest_people_count += 1

    if (current_class == 'NO-Safety Vest'):
        global no_safety_vest_people_count
        no_safety_vest_people_count += 1

    global safety_score
    if (safety_vest_people_count + no_safety_vest_people_count) != 0:
        safety_score = ((safety_vest_people_count / (safety_vest_people_count + no_safety_vest_people_count))) * 100

    else:
        safety_score = 50

    global safety_conditions
    if safety_score <= 30:
        safety_conditions = 'BAD'
    elif safety_score >= 70:
        safety_conditions = "EXCELLENT"
    elif safety_score <= 50:
        safety_conditions = "OK"
    elif safety_score >= 50:
        safety_conditions = "GOOD"

    if (current_class in ['NO-Safety Vest', 'NO_Hardhat']):

        x1, y1, x2, y2, conf = bounding_box(box, img, show_box_for_all=True)

        current_array = np.array([x1, y1, x2, y2, conf])
        detections = np.vstack((detections, current_array))  # Giving labels

        cvzone.putTextRect(img, f'{className[cls]} {conf}', (max(x1, 0), max(35, y1 - 10)), 2, 2)
        cv2.rectangle(img, (x1, y1), (x2, y2), (255, 0, 255), 3)  # Making rectangle

        resultTracker = tracker.update(detections)

        print("Frame Number : ", frame_number)
        # print (((safety_vest_people_count/(safety_vest_people_count+no_safety_vest_people_count)))*100)

        output_json_path = object_ID(img, box, cls, resultTracker, current_class, class_names, conf)

    else:
        generate_json("Non-Alert", safety_score, violators_count, safety_conditions, " ", "PPE Violation",
                      "2024-07-01T14:23:45Z",
                      frame_number,
                      {"x1": 0, "y1": 0, "x2": 0, "y2": 0}, None, None, None, "high",
                      {"camera_id": "CAM01", "location": "Warehouse Section A", "environmental_conditions": "Normal"},
                      f"{output_file_base}_{frame_number}.json")
        output_json_path = f"{output_file_base}_{frame_number}.json"

    return detections, output_json_path


###############################################################################################

# Set required class list
# class_names = ['Hardhat', 'Mask', 'NO_Hardhat', 'NO-Mask', 'NO-Safety Vest', 'Person', "Safety Cone",'Safety Vest', 'machinery', 'vehicle']

class_names = ['NO-Safety Vest', 'NO_Hardhat']

###############################################################################################

# Tracking
tracker = Sort(max_age=200, min_hits=50, iou_threshold=0.5)  # Used for tracking of cars


###############################################################################################

def detect(address: str, video_mode: str, object_counter_requirement: bool, class_names: List):
    if video_mode != "JPG":
        print("Unsupported video mode. Only 'jpg' mode is supported.")
        return

    global frame_number

    # For processing a single frame in PNG format
    img = cv2.imread(address)
    if img is None:
        print("Failed to read the image")
        return

    result = model(img, device="mps", stream=True)  # Use mps and stream feature
    detections = np.empty((0, 5))

    for r in result:
        boxes = r.boxes
        for box in boxes:
            x1, y1, x2, y2, conf = bounding_box(box, img, show_box_for_all=True)

            # Class Name Display
            cls = int(box.cls[0])
            currentClass = class_names[cls]

            # Call detections with args detections, Current Class, Interested Classes
            detections, output_json_path = class_to_track(img, box, cls, detections, currentClass, class_names)
            if (safety_vest_people_count + no_safety_vest_people_count) != 0:
                print(((safety_vest_people_count / (safety_vest_people_count + no_safety_vest_people_count)) * 100))
            else:
                print("Safety Score is 0\n")
    #
    # print(no_safety_vest_people_count)
    # print(safety_vest_people_count)
    # print("\nsafety_score")
    # print(((safety_vest_people_count / (safety_vest_people_count + no_safety_vest_people_count)) * 100))

    #cv2.imshow("Image", img)  # Show images
    torch.mps.empty_cache()
    cv2.waitKey(1)

    # Save the image with the detection box to a local folder
    output_image_path = f"../resources/detected_frames/ppe/frame_{frame_number}.jpg"
    os.makedirs(os.path.dirname(output_image_path), exist_ok=True)  # Ensure the directory exists
    cv2.imwrite(output_image_path, img)  # Save the image
    print(violators_count)
    print(violator_ID)

    frame_number += 1

    return output_image_path, output_json_path


def consume_frames():
    bootstrap_servers = 'localhost:9092'
    topic_name = 'ppe-frame-url'

    kafka_config = KafkaConfig(bootstrap_servers)
    kafka_config.create_topic(topic_name)

    consumer_conf = {
        'bootstrap.servers': bootstrap_servers,
        'group.id': 'frame-consumer-group',
        'auto.offset.reset': 'earliest'
    }

    consumer = Consumer(consumer_conf)
    consumer.subscribe([topic_name])

    while True:
        msg = consumer.poll()

        if msg is None:
            continue
        if msg.error():
            if msg.error().code() == KafkaError._PARTITION_EOF:
                continue
            else:
                print(msg.error())
                break

        frame_url = msg.value().decode('utf-8')
        print(f'Retrieved frame URL: {frame_url}')
        frame_path = os.path.join('../resources/frames/ppe/', frame_url)

        if os.path.exists(frame_path):
            print(f'Frame exists at: {frame_path}')
            detect(frame_path, "JPG", True, className)
            produce_message(frame_url)
        else:
            print(f'Frame not found at: {frame_path}')

    consumer.close()


# Kafka producer configuration
conf = {
    'bootstrap.servers': 'localhost:9092',
}

# Create the Kafka producer
producer = Producer(conf)


# Function to handle delivery reports
def delivery_report(err, msg):
    if err is not None:
        print(f'Message delivery failed: {err}')
    else:
        print(f'Message delivered to {msg.topic()}')


# Directory paths
frame_dir = '/ppe'
json_dir = '../resources/json/ppe'
export_json_dir = '../ModelService/resources/json/ppe'

# Kafka topic
topic = 'detected-frame-url'


def produce_message(frame_filename):
    frame_base = os.path.splitext(frame_filename)[0]
    json_filename = f'{frame_base}.json'
    frame_path = os.path.join(frame_dir, frame_filename)
    export_json_path = os.path.join(export_json_dir, json_filename)
    export_json_path = os.path.join(export_json_dir, json_filename)
    json_path = os.path.join(json_dir, json_filename)

    print(json_path)

    if os.path.exists(json_path):
        message = {
            'frame_url': frame_path,
            'json_url': export_json_path,
        }

        producer.produce(topic, key=frame_base, value=json.dumps(message), callback=delivery_report)
    else:
        print("Message failed!!!")


if __name__ == "__main__":
    consume_frames()
