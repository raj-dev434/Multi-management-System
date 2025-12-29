package com.example.multi_management.report.service;

import com.example.multi_management.badminton.repository.BadmintonStockRepository;
import com.example.multi_management.badminton.repository.PlayerFeeRepository;
import com.example.multi_management.common.dto.DynamicReportDTO;
import com.example.multi_management.common.dto.ReportResponseDTO;
import com.example.multi_management.stock.entity.StockMovement;
import com.example.multi_management.badminton.entity.PlayerFee;
import com.example.multi_management.stock.repository.StockMovementRepository;
import com.example.multi_management.stock.repository.StorageStockRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ReportService {

    private final StorageStockRepository storageStockRepository;
    private final BadmintonStockRepository badmintonStockRepository;
    private final PlayerFeeRepository playerFeeRepository;
    private final StockMovementRepository stockMovementRepository;
    private final com.example.multi_management.badminton.repository.BadmintonStockMovementRepository badmintonStockMovementRepository;

    public ReportService(
            StorageStockRepository storageStockRepository,
            BadmintonStockRepository badmintonStockRepository,
            PlayerFeeRepository playerFeeRepository,
            StockMovementRepository stockMovementRepository,
            com.example.multi_management.badminton.repository.BadmintonStockMovementRepository badmintonStockMovementRepository) {
        this.storageStockRepository = storageStockRepository;
        this.badmintonStockRepository = badmintonStockRepository;
        this.playerFeeRepository = playerFeeRepository;
        this.stockMovementRepository = stockMovementRepository;
        this.badmintonStockMovementRepository = badmintonStockMovementRepository;
    }

    public ReportResponseDTO generateDashboardReport() {
        ReportResponseDTO dto = new ReportResponseDTO();

        // Mechanical Stock Count (Total records or sum of quantities)
        // Here we just count the number of stock records
        dto.setTotalStockItems(storageStockRepository.count());

        // Badminton Items Count
        dto.setTotalBadmintonItems(badmintonStockRepository.count());

        // Total Player Fees Collected (Current Month)
        LocalDate startOfMonth = LocalDate.now().withDayOfMonth(1);
        LocalDate endOfMonth = LocalDate.now().with(java.time.temporal.TemporalAdjusters.lastDayOfMonth());

        List<PlayerFee> monthlyFees = playerFeeRepository.findByPaymentDateBetween(startOfMonth, endOfMonth);

        Double totalFees = monthlyFees.stream()
                .mapToDouble(fee -> fee.getAmount() != null ? fee.getAmount() : 0.0)
                .sum();
        dto.setTotalPlayerFeesCollected(totalFees);

        // Populate Widgets
        dto.setRecentStockMovements(stockMovementRepository.findTop5ByOrderByMovementDateDesc());
        dto.setTopSellingItems(
                stockMovementRepository.findTopSellingItems(org.springframework.data.domain.PageRequest.of(0, 5)));
        dto.setLowStockItems(storageStockRepository.findTop5ByCurrentQuantityLessThanOrderByCurrentQuantityAsc(5.0)); // Alert
                                                                                                                      // threshold
                                                                                                                      // <
                                                                                                                      // 5
        dto.setRecentFees(playerFeeRepository.findTop5ByOrderByPaymentDateDesc());

        return dto;
    }

    public DynamicReportDTO generateDynamicReport(LocalDate startDate, LocalDate endDate) {
        List<StockMovement> movements = stockMovementRepository.findByMovementDateBetween(startDate, endDate);
        List<PlayerFee> fees = playerFeeRepository.findByPaymentDateBetween(startDate, endDate);

        DynamicReportDTO dto = new DynamicReportDTO();
        dto.setStartDate(startDate);
        dto.setEndDate(endDate);

        // Calculate Stock Movements
        long inCount = movements.stream().filter(m -> "IN".equalsIgnoreCase(m.getMovementType())).count();
        long outCount = movements.stream().filter(m -> "OUT".equalsIgnoreCase(m.getMovementType())).count();

        dto.setTotalMovements((long) movements.size());
        dto.setMovementsIn(inCount);
        dto.setMovementsOut(outCount);
        dto.setStockMovementCount(movements.size());

        // Calculate Fees
        double totalFees = fees.stream()
                .mapToDouble(PlayerFee::getAmount)
                .sum();

        dto.setTotalFeesCollected(totalFees);
        dto.setFeeRecordCount(fees.size());

        return dto;
    }

    public List<StockMovement> getStockMovements(LocalDate startDate, LocalDate endDate, Long partyId) {
        if (partyId != null) {
            return stockMovementRepository.findByMovementDateBetweenAndPartyId(startDate, endDate, partyId);
        }
        return stockMovementRepository.findByMovementDateBetween(startDate, endDate);
    }

    public List<com.example.multi_management.badminton.entity.BadmintonStockMovement> getBadmintonMovements(
            LocalDate startDate, LocalDate endDate) {
        // Assuming findAll and filter for simplicity if between method missing, OR
        // ensure repo has query.
        // Let's rely on basic JPA or stream for now to avoid compilation error if
        // method missing.
        return badmintonStockMovementRepository.findAll().stream()
                .filter(m -> !m.getDate().isBefore(startDate) && !m.getDate().isAfter(endDate))
                .toList();
    }

    public List<PlayerFee> getPlayerFees(LocalDate startDate, LocalDate endDate, String feeType) {
        List<PlayerFee> fees = playerFeeRepository.findByPaymentDateBetween(startDate, endDate);
        if (feeType != null && !feeType.isEmpty()) {
            return fees.stream().filter(f -> feeType.equalsIgnoreCase(f.getFeeType())).toList();
        }
        return fees;
    }
}
