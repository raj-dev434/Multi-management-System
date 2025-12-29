package com.example.multi_management.stock.controller;

import com.example.multi_management.common.dto.StockMovementRequestDTO;
import com.example.multi_management.common.dto.StockResponseDTO;
import com.example.multi_management.stock.entity.StockMovement;
import com.example.multi_management.stock.service.StockService;
import org.springframework.web.bind.annotation.*;

import com.example.multi_management.stock.entity.Item;
import com.example.multi_management.stock.entity.StorageLocation;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/stock")
public class StockController {

    private final StockService stockService;

    public StockController(StockService stockService) {
        this.stockService = stockService;
    }

    // IN / OUT stock
    @PostMapping("/move")
    public StockResponseDTO moveStock(@RequestBody StockMovementRequestDTO request) {
        return stockService.processStockMovement(request);
    }

    @PostMapping("/batch-move")
    public List<StockResponseDTO> moveStockBatch(@RequestBody List<StockMovementRequestDTO> requests) {
        return stockService.processBatchStockMovement(requests);
    }

    // Get current stock
    @GetMapping("/current")
    public StockResponseDTO getCurrentStock(
            @RequestParam Long itemId,
            @RequestParam Long locationId) {

        return stockService.getCurrentStock(itemId, locationId);
    }

    @GetMapping("/current-all")
    public List<StockResponseDTO> getAllCurrentStock() {
        return stockService.getAllStock().stream()
                .map(stock -> {
                    StockResponseDTO dto = new StockResponseDTO();
                    dto.setItemId(stock.getItem().getId());
                    dto.setItemName(stock.getItem().getName());
                    dto.setStorageLocationId(stock.getStorageLocation().getId());
                    dto.setStorageLocationName(stock.getStorageLocation().getName());
                    dto.setCurrentQuantity(stock.getCurrentQuantity());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    // --- Metadata Endpoints ---

    @GetMapping("/items")
    public List<Item> getAllItems() {
        return stockService.getAllItems();
    }

    @PostMapping("/items")
    public Item createItem(@RequestBody Item item) {
        return stockService.createItem(item);
    }

    @GetMapping("/locations")
    public List<StorageLocation> getAllLocations() {
        return stockService.getAllLocations();
    }

    @PostMapping("/locations")
    public StorageLocation createLocation(@RequestBody StorageLocation location) {
        return stockService.createLocation(location);
    }

    // Get movement history
    @GetMapping("/history")
    public List<StockMovement> getHistory(
            @RequestParam Long itemId,
            @RequestParam Long locationId) {
        return stockService.getStockHistory(itemId, locationId);
    }

    @GetMapping("/search")
    public List<StockMovement> searchStockMovements(@RequestParam String partyName) {
        return stockService.searchStockMovements(partyName);
    }
}
