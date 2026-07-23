package com.microservice.inventory_service.service;

import com.microservice.inventory_service.event.OrderPlacedEvent;
import com.microservice.inventory_service.model.Inventory;
import com.microservice.inventory_service.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class InventoryService {

    private final InventoryRepository inventoryRepository;

    @Transactional(readOnly = true)
    public boolean isInStock(String skuCode, Integer quantity) {
        log.info("Checking inventory for SKU: {}", skuCode);
        return inventoryRepository.findBySkuCode(skuCode)
                .map(inventory -> inventory.getQuantity() >= quantity)
                .orElse(false);
    }

    @Transactional
    public Inventory addStock(Inventory inventory) {
        log.info("Adding stock for SKU: {}", inventory.getSkuCode());
        return inventoryRepository.save(inventory);
    }

    @KafkaListener(topics = "orderTopic", groupId = "inventory-group")
    @Transactional
    public void handleOrderPlacedEvent(OrderPlacedEvent event) {
        log.info("Received OrderPlacedEvent for order: {} with sku: {} and quantity: {}", 
            event.getOrderNumber(), event.getSkuCode(), event.getQuantity());
        
        inventoryRepository.findBySkuCode(event.getSkuCode()).ifPresent(inventory -> {
            inventory.setQuantity(inventory.getQuantity() - event.getQuantity());
            inventoryRepository.save(inventory);
            log.info("Deducted stock for SKU: {}", event.getSkuCode());
        });
    }
}
