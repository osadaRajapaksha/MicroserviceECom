package com.microservice.recommendation_service.service;

import com.microservice.recommendation_service.dto.RecommendationRequest;
import com.microservice.recommendation_service.dto.RecommendationResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AiRecommendationService {

    private final RestTemplate restTemplate;

    @Value("${ai.inference.url:http://localhost:5000/predict/recommendations}")
    private String aiInferenceUrl;

    public List<RecommendationResponse> getRecommendations(String userId) {
        // Build the request payload
        RecommendationRequest request = RecommendationRequest.builder()
                .user_id(userId)
                .recent_purchases(Collections.emptyList()) // In real app, fetch from order-service
                .build();

        try {
            // Call the Python AI inference service
            RecommendationResponse[] response = restTemplate.postForObject(
                    aiInferenceUrl, 
                    request, 
                    RecommendationResponse[].class
            );
            
            if (response != null) {
                return Arrays.asList(response);
            }
        } catch (Exception e) {
            System.err.println("Failed to reach AI inference service: " + e.getMessage());
        }
        
        return Collections.emptyList();
    }
}
