package com.gd.streaming_service.config;

import com.gd.streaming_service.controllers.StreamHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;


@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(streamWebSocketHandler(), "/ppe-streaming")
                .setAllowedOrigins("*");
    }

    @Bean
    WebSocketHandler streamWebSocketHandler() {
        return new StreamHandler();
    }
}