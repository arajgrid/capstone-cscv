from confluent_kafka.admin import AdminClient
from confluent_kafka.cimpl import NewTopic


class KafkaConfig:
    def __init__(self, bootstrap_servers):
        self.bootstrap_servers = bootstrap_servers
        self.admin_client = AdminClient({'bootstrap.servers': self.bootstrap_servers})

    def create_topic(self, topic_name, num_partitions=1, replication_factor=1):
        topic_metadata = self.admin_client.list_topics(timeout=10)
        if topic_name in topic_metadata.topics:
            print(f"Topic '{topic_name}' already exists.")
        else:
            new_topic = NewTopic(topic=topic_name, num_partitions=num_partitions, replication_factor=replication_factor)
            self.admin_client.create_topics([new_topic])
            print(f"Topic '{topic_name}' created.")
