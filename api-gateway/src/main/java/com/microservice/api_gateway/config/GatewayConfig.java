package com.microservice.api_gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("product-service", r -> r.path("/api/product", "/api/product/**")
                        .uri("lb://product-service"))
                .route("order-service", r -> r.path("/api/order", "/api/order/**")
                        .uri("lb://order-service"))
                .route("inventory-service", r -> r.path("/api/inventory", "/api/inventory/**")
                        .uri("lb://inventory-service"))
                .build();
    }
}
