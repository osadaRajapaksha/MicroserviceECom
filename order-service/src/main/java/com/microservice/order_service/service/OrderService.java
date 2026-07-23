package com.microservice.order_service.service;

import com.microservice.order_service.event.OrderPlacedEvent;
import com.microservice.order_service.model.Order;
import com.microservice.order_service.repository.OrderRepository;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final RestTemplate restTemplate;
    private final KafkaTemplate<String, OrderPlacedEvent> kafkaTemplate;

    @CircuitBreaker(name = "inventory", fallbackMethod = "fallbackMethod")
    public String placeOrder(Order order) {
        log.info("Placing order for SKU: {}", order.getSkuCode());
        
        // Call Inventory Service synchronously
        Boolean inStock = restTemplate.getForObject(
                "http://inventory-service/api/inventory/" + order.getSkuCode() + "?quantity=" + order.getQuantity(), 
                Boolean.class);

        if (Boolean.TRUE.equals(inStock)) {
            order.setOrderNumber(UUID.randomUUID().toString());
            orderRepository.save(order);
            log.info("Order saved successfully: {}", order.getOrderNumber());

            // Publish Kafka event asynchronously
            kafkaTemplate.send("orderTopic", new OrderPlacedEvent(order.getOrderNumber(), order.getSkuCode(), order.getQuantity()));
            log.info("OrderPlacedEvent published");
            
            return "Order Placed Successfully";
        } else {
            throw new IllegalArgumentException("Product is not in stock, please try again later");
        }
    }

    public String fallbackMethod(Order order, RuntimeException runtimeException) {
        log.error("Fallback triggered for order placement: {}", runtimeException.getMessage());
        return "Oops! Something went wrong, please order after some time!";
    }
}
