package com.barnawal.framesproductionservice.service.serviceImpl;

import com.barnawal.framesproductionservice.config.AppConstants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class KafkaProducerService {

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    public boolean sendFrameURL(String message, String topic) {
        try {
            kafkaTemplate.send(topic, message);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

}
