package com.gd.forklift_streaming_service.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gd.forklift_streaming_service.controller.StreamHandler;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class KafkaConsumerService {
    private final StreamHandler streamHandler;
    private final ObjectMapper objectMapper;

    public KafkaConsumerService(StreamHandler streamHandler, ObjectMapper objectMapper) {
        this.streamHandler = streamHandler;
        this.objectMapper = new ObjectMapper();
    }

    @KafkaListener(topics = "detected-frame-url-forklift", groupId = "forklift-streaming-service-group")
    public void listen(String message) {
        System.out.println("Received message: " + message);
        streamHandler.broadcast(message);
    }
}
