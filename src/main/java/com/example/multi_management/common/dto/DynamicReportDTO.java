package com.example.multi_management.common.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class DynamicReportDTO {
    private LocalDate startDate;
    private LocalDate endDate;

    // Aggregates
    private Long totalMovements;
    private Long movementsIn;
    private Long movementsOut;
    private Double totalFeesCollected;

    // Detailed counts if needed
    private int stockMovementCount;
    private int feeRecordCount;
}
