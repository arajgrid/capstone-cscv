package com.gd.forklift_streaming_service.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashSet;
import java.util.Set;

@Component
public class StreamHandler extends TextWebSocketHandler {

    private static final Set<WebSocketSession> sessions = new HashSet<>();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.add(session);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        sessions.remove(session);
    }

    public void broadcast(String message) {
        try {
            JsonNode messageNode = objectMapper.readTree(message);
            String frameUrl = messageNode.get("frame_url").asText();
            String jsonUrl = messageNode.get("json_url").asText();

            String jsonContent = new String(Files.readAllBytes(Paths.get(jsonUrl)));
            JsonNode jsonNode = objectMapper.readTree(jsonContent);

            JsonNode broadcastMessage = objectMapper.createObjectNode()
                    .put("frame_url", frameUrl)
                    .set("json", jsonNode);

            String finalMessage = objectMapper.writeValueAsString(broadcastMessage);

            for (WebSocketSession session : sessions) {
                try {
                    session.sendMessage(new TextMessage(finalMessage));
                } catch (IOException e) {
                    System.out.println("Error broadcasting message: " + e.getMessage());
                }
            }
        } catch (IOException e) {
            System.out.println("Error reading or parsing JSON: " + e.getMessage());
        }
    }
}
