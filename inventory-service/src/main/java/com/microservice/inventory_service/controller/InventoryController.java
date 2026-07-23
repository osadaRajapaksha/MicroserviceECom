package com.microservice.inventory_service.controller;

import com.microservice.inventory_service.model.Inventory;
import com.microservice.inventory_service.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping("/{skuCode}")
    @ResponseStatus(HttpStatus.OK)
    public boolean isInStock(@PathVariable String skuCode, @RequestParam(defaultValue = "1") Integer quantity) {
        return inventoryService.isInStock(skuCode, quantity);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Inventory addStock(@RequestBody Inventory inventory) {
        return inventoryService.addStock(inventory);
    }
}
