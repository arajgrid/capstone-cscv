#######################################################################################################
from confluent_kafka.cimpl import Consumer, KafkaError
from ultralyticsplus import YOLO, render_result
import cv2
import base64
from PIL import Image
import base64
import cvzone
import torch
import math
import json

from confluent_kafka import Producer
from kafka.kafka_config import KafkaConfig
from sort import *
from Utils import *
import numpy as np

#######################################################################################################

# load model

model = YOLO('forklift.pt')

class_names = ['forklift', 'person']

forklift_coordinates = {}

# Global file path base
output_file_base = "../resources/json/forklift/frame"

# Frame Counter initialized
frame_number = 0

# Voilations dictionary initialized
voilation_dict = {}

# violators count:
violators_count = 0

violator_ID = []

average_distance = []
min_distance_list = [100]

min_distance_to_write = None

min_distance_average = []

tags = [None, None, None]

flag = 0

#######################################################################################################

# Tracking Forklifts
tracker_forklift = Sort(max_age=200, min_hits=50, iou_threshold=0.3)

# Tracking People
tracker_person = Sort(max_age=200, min_hits=20, iou_threshold=0.3)


#######################################################################################################

def safety_condition(label_to_genrate):
    if label_to_genrate is None:
        return "None"
    if label_to_genrate < 200:
        return "BAD"
    elif 200 <= label_to_genrate < 500:
        return "GOOD"
    else:
        return "EXCELLENT"


def simple_plot(numbers, figsize=(8, 6), linestyle='-', marker='o', color='b', title=None, xlabel='Index',
                ylabel='Value'):
    # Input validation
    if not isinstance(numbers, (list, np.ndarray)):
        raise TypeError('Input numbers must be a list or numpy array.')

    if len(numbers) == 0:
        raise ValueError('Input numbers should not be empty.')

    indices = list(range(len(numbers)))

    # Plotting index vs. value
    plt.figure(figsize=figsize)
    plt.plot(indices, numbers, marker=marker, linestyle=linestyle, color=color, label='Index vs Value')

    # Adding labels and title
    plt.xlabel(xlabel)
    plt.ylabel(ylabel)
    if title:
        plt.title(title)
    else:
        plt.title('Plot of Index vs Value')
    plt.legend()

    # Display the plot
    plt.show()


def distance_calculator_and_colourer(img, x1_person, y1_person, x2_person, y2_person):
    """

        This funcion will take the coorinates of person and colour the boxes according to proximity of the person with forklift.
        The box will be red in colour if the person is too close to forklift, else yellow if in medium range. Finally green if safe.

        The distance percieved by the model is dependent on the camera angle, which can be changed for a perticular angle to make the readings more accurate.

    """
    global tags
    global average_distance
    global people_distance
    global forklift_coordinates
    all_distances = []

    if not forklift_coordinates:
        cvzone.putTextRect(img, 'Person', (max(x1_person, 0), max(35, y1_person - 10)), scale=1, thickness=1,
                           colorR=(0, 255, 0), colorT=(0, 0, 0))
        cv2.rectangle(img, (x1_person, y1_person), (x2_person, y2_person), (0, 255, 0), 1)  # Making rectangle
        return

    for forklift, coordinates in forklift_coordinates.items():
        x1_forklift, y1_forklift, x2_forklift, y2_forklift = coordinates

        person_bottom_center_coordinates = ((x1_person + x2_person) // 2, y2_person)
        forklift_bottom_center_coordinates = ((x1_forklift + x2_forklift) // 2, y2_forklift)

        distance = math.sqrt((person_bottom_center_coordinates[0] - forklift_bottom_center_coordinates[0]) ** 2 +
                             (person_bottom_center_coordinates[1] - forklift_bottom_center_coordinates[1]) ** 2)

        average_distance.append(distance)

        person_center_coordinates = ((x1_person + x2_person) // 2, (y1_person + y2_person) // 2)
        forklift_center_coordinates = ((x1_forklift + x2_forklift) // 2, (y1_forklift + y2_forklift) // 2)

        distance_from_center = math.sqrt((person_center_coordinates[0] - forklift_center_coordinates[0]) ** 2 +
                                         (person_center_coordinates[1] - forklift_center_coordinates[1]) ** 2)

        all_distances.append(distance_from_center)

    all_distances.sort()
    min_distance = all_distances[0]

    tags[1] = sum(average_distance) / len(average_distance)
    tags[2] = safety_condition(tags[1])

    # Check if the person is inside the forklift box
    if (x1_person >= x1_forklift and y1_person >= y1_forklift and
            x2_person <= x2_forklift and y2_person <= y2_forklift):
        cvzone.putTextRect(img, 'Person Inside Forklift', (max(x1_person, 0), max(35, y1_person - 10)), 1, 1)
        cv2.rectangle(img, (x1_person, y1_person), (x2_person, y2_person), (255, 0, 0), 1)  # Blue color for inside



    elif min_distance >= 300:
        cvzone.putTextRect(img, 'Person', (max(x1_person, 0), max(35, y1_person - 10)), scale=1, thickness=1,
                           colorR=(0, 255, 0), colorT=(0, 0, 0))
        cv2.rectangle(img, (x1_person, y1_person), (x2_person, y2_person), (0, 255, 0), 1)  # Making rectangle
        cv2.line(img, ((x1_person + x2_person) // 2, (y1_person + y2_person) // 2),
                 ((x1_forklift + x2_forklift) // 2, (y1_forklift + y2_forklift) // 2), (0, 255, 0), 3)
        cvzone.putTextRect(img, f"{min_distance:.2f}", (
        (person_center_coordinates[0] + forklift_center_coordinates[0]) // 2,
        (person_center_coordinates[1] + forklift_center_coordinates[1]) // 2), scale=1, thickness=1, colorR=(0, 255, 0),
                           colorT=(0, 0, 0))
        if people_distance is None:
            people_distance = distance_from_center
        elif people_distance >= distance_from_center:
            people_distance = distance_from_center



    elif min_distance <= 100:
        cvzone.putTextRect(img, 'Person', (max(x1_person, 0), max(35, y1_person - 10)), scale=1, thickness=1,
                           colorR=(0, 0, 255), colorT=(0, 0, 0))
        cv2.rectangle(img, (x1_person, y1_person), (x2_person, y2_person), (0, 0, 255), 1)  # Making rectangle
        cv2.line(img, ((x1_person + x2_person) // 2, (y1_person + y2_person) // 2),
                 ((x1_forklift + x2_forklift) // 2, (y1_forklift + y2_forklift) // 2), (0, 0, 255), 3)
        cvzone.putTextRect(img, f"{min_distance:.2f}", (
        (person_center_coordinates[0] + forklift_center_coordinates[0]) // 2,
        (person_center_coordinates[1] + forklift_center_coordinates[1]) // 2), scale=1, thickness=1, colorR=(0, 0, 255),
                           colorT=(0, 0, 0))
        if people_distance is None:
            people_distance = distance_from_center
        elif people_distance >= distance_from_center:
            people_distance = distance_from_center


    else:
        colour = (0, 255, 255)
        min_distance_new = min_distance - 100

        green_value = int(max(0, min(255, (min_distance_new * 255) // 200)))
        new_colour = (colour[0], green_value, colour[2])

        cvzone.putTextRect(img, 'Person', (max(x1_person, 0), max(35, y1_person - 10)), scale=1, thickness=2,
                           colorR=new_colour, colorT=(0, 0, 0))
        cv2.rectangle(img, (x1_person, y1_person), (x2_person, y2_person), new_colour, 2)
        cv2.line(img, ((x1_person + x2_person) // 2, (y1_person + y2_person) // 2),
                 ((x1_forklift + x2_forklift) // 2, (y1_forklift + y2_forklift) // 2), new_colour, 3)
        cvzone.putTextRect(img, f"{min_distance:.2f}", (
        (person_center_coordinates[0] + forklift_center_coordinates[0]) // 2,
        (person_center_coordinates[1] + forklift_center_coordinates[1]) // 2), scale=1, thickness=1, colorR=new_colour,
                           colorT=(0, 0, 0))
        if people_distance is None:
            people_distance = distance_from_center
        elif people_distance >= distance_from_center:
            people_distance = distance_from_center

    output_image_path = f"../resources/detected_frames/forklift/frame_{frame_number}.jpg"
    os.makedirs(os.path.dirname(output_image_path), exist_ok=True)  # Ensure the directory exists
    cv2.imwrite(output_image_path, img)  # Save the image

    return output_image_path


def person_proximity_alert(img, box, cls: int, detections_person, current_class: str, class_names: List):
    """

        Checks if the person detection confidence is more than 40%, also updates co-ordinates and tracker to track the person.
        Calls the function to colour the box according to the distance from the forklift.

    """
    output_image_path = None
    if current_class == "person":

        x1, y1, x2, y2, conf = bounding_box(box, img, show_box_for_all=True)

        if conf >= 0.40:
            current_array = np.array([x1, y1, x2, y2, conf])
            detections_person = np.vstack((detections_person, current_array))  # Giving labels

            resultTracker_person = tracker_person.update(detections_person)

            for results in resultTracker_person:
                x1, y1, x2, y2, Id = results
                x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
                w, h = x2 - x1, y2 - y1
                x_center, y_center = x1 + w // 2, y1 + h // 2

                # cvzone.putTextRect(img, 'Person', (max(x1_person, 0), max(35, y1_person - 10)), scale=1, thickness=2, colorR=new_colour, colorT=(0, 0, 0))
            # cv2.rectangle(img, (x1_person, y1_person), (x2_person, y2_person), new_colour, 2)

            output_image_path = distance_calculator_and_colourer(img, x1, y1, x2, y2)
            # cvzone.putTextRect(img, f"ID - {int(Id)}", (max(x2 - w - 10, 0),max(y2 - 10, h) ), 1.5, 2)

            # cvzone.putTextRect(img,f'{class_names[cls]} {conf}', (max(x1, 0), max(35, y1-10)), 2, 2)
            # cv2.rectangle(img, (x1,y1), (x2,y2), (255,0,255),3)     # Making rectangle

    if people_distance:
        tags[0] = people_distance
    else:
        # Handle the case when people_distance is empty
        tags[0] = None  # or any default value that makes sense in your context

    if output_image_path == None:
        output_image_path = f"../resources/detected_frames/forklift/frame_{frame_number}.jpg"
        os.makedirs(os.path.dirname(output_image_path), exist_ok=True)  # Ensure the directory exists
        cv2.imwrite(output_image_path, img)  # Save the image

    return detections_person, output_image_path


def fork_lift_tracker(img, box, cls: int, detections_forklift, current_class: str, class_names: List):
    """
        Program to identify and tag fork lift in a program
        Returns Detections

    """

    if current_class == "forklift":

        # Making sure we use global variables.
        global forklift_coordinates
        global voilation_dict
        global frame_number

        # Getting co-ordinates of the detections
        x1, y1, x2, y2, conf = bounding_box(box, img, show_box_for_all=True)

        # Updating the detections stack for ID usage
        current_array = np.array([x1, y1, x2, y2, conf])
        detections_forklift = np.vstack((detections_forklift, current_array))  # Giving labels
        resultTracker_forklift = tracker_forklift.update(detections_forklift)

        # cvzone.putTextRect(img,f'{class_names[cls]} {conf}', (max(x1, 0), max(35, y1-10)), 2, 2)
        # cv2.rectangle(img, (x1,y1), (x2,y2), (255,0,255),3)     # Making rectangle

        for results in resultTracker_forklift:
            x1, y1, x2, y2, Id = results
            x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
            w, h = x2 - x1, y2 - y1
            x_center, y_center = x1 + w // 2, y1 + h // 2

            if (Id not in voilation_dict.keys() and Id != None):
                voilation_dict[Id] = [frame_number, 1, conf]

            else:

                if (voilation_dict[Id][1] == -999):

                    # Case if we have reached our confirmation hit number

                    forklift_coordinates[Id] = [x1, y1, x2, y2]

                    cvzone.putTextRect(img, f"ID - {int(Id)}", (max(x2 - w - 10, 0), max(y2 - 10, h)), 1, 1)
                    cvzone.putTextRect(img, f'{class_names[cls]} {conf}', (max(x1, 0), max(35, y1 - 10)), 1, 1)
                    cv2.rectangle(img, (x1, y1), (x2, y2), (255, 0, 255), 1)  # Making rectangle
                    # cv2.circle(img, ((x1+x2)//2, (y1+y2)//2), 10, (0, 255, 0) , thickness=-1)



                elif (voilation_dict[Id][0] in range(frame_number - 10, frame_number + 10)):

                    # Case if we get a hit

                    if (voilation_dict[Id][1] == 2):  # confirmation hit number reached, assigns -999
                        voilation_dict[Id][1] = -999
                        # print ("\n\n ENTERED FRAME ")
                        # print (voilation_dict[1][1])

                    else:
                        voilation_dict[Id][0] = frame_number
                        voilation_dict[Id][1] += 1  # Increment the count of hits
                        voilation_dict[Id][2] = max(voilation_dict[Id][2], conf)  # Updating max confidence
                        # print ("\n Frame Number", frame_number)
                        # print (voilation_dict[1][1])

                elif (voilation_dict[Id][0] not in range(frame_number - 10, frame_number + 10)):

                    # Case is
                    voilation_dict[Id][0] = frame_number
                    voilation_dict[Id][1] = 1
                    voilation_dict[Id][2] = conf
                    # print ("\n Frame Number", frame_number)


                else:

                    print("UNKNOWN VIOLATION")
                    quit()

    return detections_forklift


def make_json(write_path: str):

    global min_distance_list
    global min_distance_to_write
    min_distance_alert = None

    if len(min_distance_list) % 20 == 0:
        min_distance_to_write = sum(min_distance_list) / len(min_distance_list)
        min_distance_list = [min_distance_to_write]
        flag = 1
        if min_distance_to_write > 200:
            min_distance_alert = None
        else:
            min_distance_alert = min_distance_to_write

    elif min_distance_to_write is None:
        min_distance_to_write = 100

    data = {
        "minimum_distance": min_distance_to_write,
        "average_distance": tags[1],
        "proximity_score": tags[2],
        "min_distance_alert": min_distance_alert,

    }


    with open(write_path, "w") as f:
        json.dump(data, f, indent=4)


def detect(address: str, object_counter_requirement: bool, video_mode: str):
    global people_distance
    people_distance = None


    if video_mode != "JPG":
        print("Unsupported video mode. Only 'JPG' mode is supported.")
        return

    # For processing a single frame in PNG format
    img = cv2.imread(address)
    if img is None:
        print("Failed to read the image")
        return

    result = model(img, device="mps", stream=True)  # Use mps and stream feature
    detections = np.empty((0, 5))

    while True:

        global frame_number
        frame_number += 1
        print(frame_number)
        output_image_path = None

        img = cv2.imread(address)

        if img is None:
            print("Failed to read the image")
            return

        img = cv2.resize(img, (1280, 720))

        if video_mode == "MP4":
            imgRegion = img
            result = model(imgRegion, device="mps", stream=True)  # Use mps and stream feature

        else:
            result = model(img, device="mps", stream=True)  # Use mps and stream feature )

        detections_person = np.empty((0, 5))
        detections_forklift = np.empty((0, 5))

        for r in result:

            boxes = r.boxes
            for box in boxes:

                x1, y1, x2, y2, conf = bounding_box(box, img, show_box_for_all=True)
                w, h = x2 - x1, y2 - y1  # Calculating width and length

                # Class Name Display
                cls = int(box.cls[0])

                currentClass = class_names[cls]
                # print (cls)
                # print (currentClass)

                # for key, value in forklift_coordinates.items():
                #     print(f"{key}: {value}")

                # detections_forklift = fork_lift_tracker(img, box, cls, detections_forklift, currentClass, class_names )

                # detections_person = person_proximity_alert(img, box, cls, detections_forklift, currentClass, class_names )

                if (currentClass == "person"):
                    detections_person, output_image_path = person_proximity_alert(img, box, cls, detections_forklift,
                                                                                  currentClass, class_names)

                elif (currentClass == "forklift"):
                    detections_forklift = fork_lift_tracker(img, box, cls, detections_forklift, currentClass,
                                                            class_names)

                if output_image_path == None:
                    output_image_path = f"../resources/detected_frames/forklift/frame_{frame_number}.jpg"
                    os.makedirs(os.path.dirname(output_image_path), exist_ok=True)  # Ensure the directory exists
                    cv2.imwrite(output_image_path, img)  # Save the image

                # for key, value in voilation_dict.items():
                #     print(f"{key}: {value}")

                output_json_path = f"{output_file_base}_{frame_number}.json"
                make_json(output_json_path)

        print(tags[0], tags[1], tags[2])

        global min_distance_list
        if tags[0] is not None and tags[0] > 100:
            min_distance_list.append(tags[0])

        #cv2.imshow("Image", img)  # Show images
        torch.mps.empty_cache()
        cv2.waitKey(1)

        # print("\nMIN DISTANCE LIST : ", min_distance_list)
        return output_image_path, output_json_path


def consume_frames():
    bootstrap_servers = 'localhost:9092'
    topic_name = 'forklift-frame-url'

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
        frame_path = os.path.join('../resources/frames/forklift', frame_url)

        if os.path.exists(frame_path):
            print(f'Frame exists at: {frame_path}')
            detect(frame_path, True, "JPG")
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
frame_dir = '/forklift'
json_dir = '../resources/json/forklift'
export_json_dir = '../ModelService/resources/json/forklift'
export_frame_dir = '../ModelService/resources/detected_frames/forklift'

# Kafka topic
topic = 'detected-frame-url-forklift'


def produce_message(frame_filename):
    frame_base = os.path.splitext(frame_filename)[0]
    json_filename = f'{frame_base}.json'
    frame_path = os.path.join(frame_dir, frame_filename)
    export_frame_path = os.path.join(export_frame_dir, frame_filename)
    export_json_path = os.path.join(export_json_dir, json_filename)
    json_path = os.path.join(json_dir, json_filename)

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
