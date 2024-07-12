package com.gd.streaming_service.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.gd.streaming_service.controllers.StreamHandler;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.stream.Stream;

@Service
public class KafkaConsumerService {
    private final StreamHandler streamHandler;
    private final ObjectMapper objectMapper;

    public KafkaConsumerService(StreamHandler streamHandler, ObjectMapper objectMapper) {
        this.streamHandler = streamHandler;
        this.objectMapper = new ObjectMapper();
    }

    @KafkaListener(topics = "detected-frame-url", groupId = "streaming-service-group")
    public void listen(String message) {
        System.out.println("Received message: " + message);
        streamHandler.broadcast(message);
    }
}
