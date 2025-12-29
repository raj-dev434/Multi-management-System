package com.example.multi_management.common.dto;

import lombok.Data;
import java.util.List;
import com.example.multi_management.stock.entity.StockMovement;
import com.example.multi_management.stock.entity.StorageStock;
import com.example.multi_management.badminton.entity.PlayerFee;

@Data
public class ReportResponseDTO {
    private Long totalStockItems; // Count of StorageStock records or unique items
    private Long totalBadmintonItems;
    private Double totalPlayerFeesCollected;

    // New Dashboard Widgets
    private List<StockMovement> recentStockMovements;
    private List<StorageStock> lowStockItems;
    private List<PlayerFee> recentFees;

    // New Chart Data
    private List<TopItemDTO> topSellingItems;
}
