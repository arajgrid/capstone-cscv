package com.barnawal.framesproductionservice.service;

public interface VideoFrameProvider {
    void start(String source, String topic);
    void stop();
}

