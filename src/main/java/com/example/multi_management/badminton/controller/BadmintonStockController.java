package com.example.multi_management.badminton.controller;

import com.example.multi_management.badminton.entity.BadmintonStock;
import com.example.multi_management.badminton.service.BadmintonStockService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import lombok.Data;

@RestController
@RequestMapping("/api/badminton/stock")
public class BadmintonStockController {

    private final BadmintonStockService stockService;

    public BadmintonStockController(BadmintonStockService stockService) {
        this.stockService = stockService;
    }

    @PostMapping
    public BadmintonStock addStock(@RequestBody BadmintonStock stock) {
        return stockService.addStock(stock);
    }

    @PostMapping("/sell")
    public com.example.multi_management.badminton.entity.BadmintonStockMovement sellStock(
            @RequestBody SellStockRequest request) {
        return stockService.sellStock(request.getStockId(), request.getQuantity(), request.getSoldTo());
    }

    @Data
    public static class SellStockRequest {
        private Long stockId;
        private Integer quantity;
        private String soldTo;
    }

    @GetMapping
    public List<BadmintonStock> getAllStock() {
        return stockService.getAllStock();
    }

    @PutMapping("/{id}")
    public BadmintonStock updateStock(@PathVariable Long id, @RequestParam Integer quantity) {
        return stockService.updateStock(id, quantity);
    }
}
