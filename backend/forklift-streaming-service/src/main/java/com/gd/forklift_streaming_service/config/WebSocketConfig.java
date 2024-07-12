package com.gd.forklift_streaming_service.config;

import com.gd.forklift_streaming_service.controller.StreamHandler;
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
        registry.addHandler(streamWebSocketHandler(), "/forklift-streaming")
                .setAllowedOrigins("*");
    }

    @Bean
    WebSocketHandler streamWebSocketHandler() {
        return new StreamHandler();
    }
}
