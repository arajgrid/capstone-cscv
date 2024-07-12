package com.barnawal.framesproductionservice.service.serviceImpl;


import com.barnawal.framesproductionservice.service.VideoFrameProvider;
import org.springframework.stereotype.Service;

@Service
public class WebRTCFrameProvider implements VideoFrameProvider {

    @Override
    public void start(String source, String topic) {
        // Placeholder for WebRTC implementation
        throw new UnsupportedOperationException("WebRTCFrameProvider not implemented yet");
    }

    @Override
    public void stop() {
        // Placeholder for WebRTC implementation
    }
}
