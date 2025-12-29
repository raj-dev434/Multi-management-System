package com.example.multi_management.common.dto;

import lombok.Data;

@Data
public class StockMovementRequestDTO {
    private Long itemId;
    private Long storageLocationId;
    private Double quantity;
    private String movementType; // IN, OUT
    private Long partyId; // Optional (Supplier/Customer)
    private String employeeName;

    // New fields for Old Stock / Custom Dates
    private java.time.LocalDate movementDate;
    private String remarks;
}
