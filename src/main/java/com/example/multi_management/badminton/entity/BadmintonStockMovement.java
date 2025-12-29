package com.example.multi_management.badminton.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
public class BadmintonStockMovement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "stock_id")
    private BadmintonStock badmintonStock;

    private Integer quantity;
    private String type; // IN (Add), OUT (Sold)
    private LocalDate date;
    private String soldTo; // Player Name or Batch Name

}
