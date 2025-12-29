package com.example.multi_management.report.controller;

import com.example.multi_management.common.dto.ReportResponseDTO;
import com.example.multi_management.report.service.ReportService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/report")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/dashboard")
    public ReportResponseDTO getDashboardReport() {
        return reportService.generateDashboardReport();
    }

    @org.springframework.web.bind.annotation.GetMapping("/dynamic")
    public com.example.multi_management.common.dto.DynamicReportDTO getDynamicReport(
            @org.springframework.web.bind.annotation.RequestParam java.time.LocalDate startDate,
            @org.springframework.web.bind.annotation.RequestParam java.time.LocalDate endDate) {

        return reportService.generateDynamicReport(startDate, endDate);
    }

    @GetMapping("/stock-movements")
    public java.util.List<com.example.multi_management.stock.entity.StockMovement> getStockMovements(
            @org.springframework.web.bind.annotation.RequestParam java.time.LocalDate startDate,
            @org.springframework.web.bind.annotation.RequestParam java.time.LocalDate endDate,
            @org.springframework.web.bind.annotation.RequestParam(required = false) Long partyId) {
        return reportService.getStockMovements(startDate, endDate, partyId);
    }

    @GetMapping("/badminton-movements")
    public java.util.List<com.example.multi_management.badminton.entity.BadmintonStockMovement> getBadmintonMovements(
            @org.springframework.web.bind.annotation.RequestParam java.time.LocalDate startDate,
            @org.springframework.web.bind.annotation.RequestParam java.time.LocalDate endDate) {
        return reportService.getBadmintonMovements(startDate, endDate);
    }

    @GetMapping("/player-fees")
    public java.util.List<com.example.multi_management.badminton.entity.PlayerFee> getPlayerFees(
            @org.springframework.web.bind.annotation.RequestParam java.time.LocalDate startDate,
            @org.springframework.web.bind.annotation.RequestParam java.time.LocalDate endDate,
            @org.springframework.web.bind.annotation.RequestParam(required = false) String feeType) {
        return reportService.getPlayerFees(startDate, endDate, feeType);
    }
}
