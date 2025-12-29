package com.example.multi_management.badminton.service;

import com.example.multi_management.badminton.entity.BadmintonStock;
import com.example.multi_management.badminton.repository.BadmintonStockRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BadmintonStockService {

    private final BadmintonStockRepository stockRepository;
    private final com.example.multi_management.badminton.repository.BadmintonStockMovementRepository movementRepository;

    public BadmintonStockService(BadmintonStockRepository stockRepository,
            com.example.multi_management.badminton.repository.BadmintonStockMovementRepository movementRepository) {
        this.stockRepository = stockRepository;
        this.movementRepository = movementRepository;
    }

    public BadmintonStock addStock(BadmintonStock stock) {
        return stockRepository.save(stock);
    }

    public com.example.multi_management.badminton.entity.BadmintonStockMovement sellStock(Long stockId, int quantity,
            String soldTo) {
        BadmintonStock stock = stockRepository.findById(stockId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        if (stock.getQuantity() < quantity) {
            throw new RuntimeException("Insufficient stock! Available: " + stock.getQuantity());
        }

        stock.setQuantity(stock.getQuantity() - quantity);
        stockRepository.save(stock);

        com.example.multi_management.badminton.entity.BadmintonStockMovement movement = new com.example.multi_management.badminton.entity.BadmintonStockMovement();
        movement.setBadmintonStock(stock);
        movement.setQuantity(quantity);
        movement.setType("OUT");
        movement.setDate(java.time.LocalDate.now());
        movement.setSoldTo(soldTo);

        return movementRepository.save(movement);
    }

    public List<BadmintonStock> getAllStock() {
        return stockRepository.findAll();
    }

    public BadmintonStock updateStock(Long id, Integer quantity) {
        BadmintonStock stock = stockRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stock not found"));
        stock.setQuantity(quantity);
        return stockRepository.save(stock);
    }
}
