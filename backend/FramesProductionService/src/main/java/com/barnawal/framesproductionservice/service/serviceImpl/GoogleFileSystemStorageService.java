package com.barnawal.framesproductionservice.service.serviceImpl;

import com.barnawal.framesproductionservice.service.FrameStorageService;
import org.springframework.stereotype.Service;


@Service
public class GoogleFileSystemStorageService implements FrameStorageService {

    @Override
    public String storeFrame(byte[] frameData, String topic) {
        return null;
    }

}
