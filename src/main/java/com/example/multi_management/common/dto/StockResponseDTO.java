package com.example.multi_management.common.dto;

import lombok.Data;

@Data
public class StockResponseDTO {
    private Long itemId;
    private String itemName;
    private Long storageLocationId;
    private String storageLocationName;
    private Double currentQuantity;
}
