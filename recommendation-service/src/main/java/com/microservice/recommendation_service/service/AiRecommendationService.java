package com.microservice.recommendation_service.service;

import com.microservice.recommendation_service.dto.RecommendationResponse;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AiRecommendationService {

    /**
     * In a production environment, this method would:
     * 1. Call Order Service to get user's past orders.
     * 2. Call Product Service to get the current product catalog.
     * 3. Send a prompt to an LLM (e.g., Google Gemini API) with the user data and catalog.
     * 4. Parse the LLM's JSON response into a list of RecommendationResponse.
     * 
     * For this MVP, we provide a mock AI behavior that returns intelligent-looking suggestions.
     */
    public List<RecommendationResponse> getRecommendations(String userId) {
        List<RecommendationResponse> recommendations = new ArrayList<>();
        
        // Mock AI reasoning based on general e-commerce patterns
        recommendations.add(RecommendationResponse.builder()
                .productId("prod-101")
                .productName("Wireless Noise-Canceling Headphones")
                .reason("Based on your recent interest in electronics, these headphones match your premium preference.")
                .build());
                
        recommendations.add(RecommendationResponse.builder()
                .productId("prod-102")
                .productName("Ergonomic Office Chair")
                .reason("Customers who browse laptops frequently upgrade their home office setup with this chair.")
                .build());
                
        recommendations.add(RecommendationResponse.builder()
                .productId("prod-103")
                .productName("Smart Home Hub")
                .reason("Since you purchased smart lighting, this hub will help you centralize your home automation.")
                .build());

        return recommendations;
    }
}
