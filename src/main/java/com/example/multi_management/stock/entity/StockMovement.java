package com.example.multi_management.stock.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "stock_movement")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StockMovement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "storage_stock_id", nullable = false)
    private StorageStock storageStock;

    @Column(nullable = false)
    private String movementType; // IN, OUT

    @Column(nullable = false)
    private Double quantity;

    @Column(nullable = false)
    private LocalDate movementDate;

    private String employeeName;

    @ManyToOne
    @JoinColumn(name = "party_id")
    private Party party;

    private String remarks;
}
