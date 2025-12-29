package com.example.multi_management.stock.service;

import com.example.multi_management.common.dto.StockMovementRequestDTO;
import com.example.multi_management.common.dto.StockResponseDTO;
import com.example.multi_management.stock.entity.Item;
import com.example.multi_management.stock.entity.StockMovement;
import com.example.multi_management.stock.entity.StorageLocation;
import com.example.multi_management.stock.entity.StorageStock;
import com.example.multi_management.stock.repository.ItemRepository;
import com.example.multi_management.stock.repository.StockMovementRepository;
import com.example.multi_management.stock.repository.StorageLocationRepository;
import com.example.multi_management.stock.repository.StorageStockRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class StockService {

    private final ItemRepository itemRepository;
    private final StorageLocationRepository locationRepository;
    private final StorageStockRepository storageStockRepository;
    private final StockMovementRepository stockMovementRepository;
    private final com.example.multi_management.stock.repository.PartyRepository partyRepository;

    public StockService(
            ItemRepository itemRepository,
            StorageLocationRepository locationRepository,
            StorageStockRepository storageStockRepository,
            StockMovementRepository stockMovementRepository,
            com.example.multi_management.stock.repository.PartyRepository partyRepository) {

        this.itemRepository = itemRepository;
        this.locationRepository = locationRepository;
        this.storageStockRepository = storageStockRepository;
        this.stockMovementRepository = stockMovementRepository;
        this.partyRepository = partyRepository;
    }

    @Transactional
    public List<StockResponseDTO> processBatchStockMovement(List<StockMovementRequestDTO> requests) {
        return requests.stream().map(this::processStockMovement).toList();
    }

    @Transactional
    public StockResponseDTO processStockMovement(StockMovementRequestDTO request) {

        Item item = itemRepository.findById(request.getItemId())
                .orElseThrow(() -> new RuntimeException("Item not found"));

        StorageLocation location = locationRepository.findById(request.getStorageLocationId())
                .orElseThrow(() -> new RuntimeException("Location not found"));

        StorageStock storageStock = storageStockRepository
                .findByItemAndStorageLocation(item, location)
                .orElseGet(() -> createNewStock(item, location));

        double updatedQuantity;

        if ("IN".equalsIgnoreCase(request.getMovementType())) {
            updatedQuantity = storageStock.getCurrentQuantity() + request.getQuantity();
        } else {
            if (storageStock.getCurrentQuantity() < request.getQuantity()) {
                throw new RuntimeException("Insufficient stock! Available: " + storageStock.getCurrentQuantity());
            }
            updatedQuantity = storageStock.getCurrentQuantity() - request.getQuantity();
        }

        storageStock.setCurrentQuantity(updatedQuantity);
        storageStockRepository.save(storageStock);

        StockMovement movement = new StockMovement();
        movement.setStorageStock(storageStock);
        movement.setMovementType(request.getMovementType());
        movement.setQuantity(request.getQuantity());

        // Use provided date or default to today
        if (request.getMovementDate() != null) {
            movement.setMovementDate(request.getMovementDate());
        } else {
            movement.setMovementDate(LocalDate.now());
        }

        movement.setRemarks(request.getRemarks());
        movement.setEmployeeName(request.getEmployeeName());

        if (request.getPartyId() != null) {
            com.example.multi_management.stock.entity.Party party = partyRepository.findById(request.getPartyId())
                    .orElseThrow(() -> new RuntimeException("Party not found"));
            movement.setParty(party);
        }

        stockMovementRepository.save(movement);

        return mapToResponse(storageStock);
    }

    private StorageStock createNewStock(Item item, StorageLocation location) {
        StorageStock stock = new StorageStock();
        stock.setItem(item);
        stock.setStorageLocation(location);
        stock.setCurrentQuantity(0.0);
        return stock;
    }

    public StockResponseDTO getCurrentStock(Long itemId, Long locationId) {
        StorageStock stock = storageStockRepository
                .findByItemIdAndStorageLocationId(itemId, locationId)
                .orElseThrow(() -> new RuntimeException("Stock not found"));

        return mapToResponse(stock);
    }

    public List<StockMovement> getStockHistory(Long itemId, Long locationId) {
        return stockMovementRepository
                .findByStorageStock_Item_IdAndStorageStock_StorageLocation_Id(itemId, locationId);
    }

    public List<StockMovement> searchStockMovements(String partyName) {
        return stockMovementRepository.findByParty_NameContainingIgnoreCase(partyName);
    }

    public List<StorageStock> getAllStock() {
        return storageStockRepository.findAll();
    }

    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    public Item createItem(Item item) {
        return itemRepository.save(item);
    }

    public List<StorageLocation> getAllLocations() {
        return locationRepository.findAll();
    }

    public StorageLocation createLocation(StorageLocation location) {
        return locationRepository.save(location);
    }

    private StockResponseDTO mapToResponse(StorageStock stock) {
        StockResponseDTO dto = new StockResponseDTO();
        dto.setItemId(stock.getItem().getId());
        dto.setItemName(stock.getItem().getName());
        dto.setStorageLocationId(stock.getStorageLocation().getId());
        dto.setStorageLocationName(stock.getStorageLocation().getName());
        dto.setCurrentQuantity(stock.getCurrentQuantity());
        return dto;
    }
}
