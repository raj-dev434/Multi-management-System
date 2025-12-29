package com.example.multi_management.badminton.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "player_fee")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlayerFee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String playerName;

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    private LocalDate paymentDate;

    // e.g., "JANUARY", "FEBRUARY"
    @Column(nullable = false)
    private String month;

    @Column(nullable = false)
    private Integer year;

    // PAID, PENDING, OVERDUE
    @Column(nullable = false)
    private String status;

    // New Fields
    private String feeType; // BATCH, GUEST, COACHING
    private Double durationHours; // For Guest
    private String courtNumber;
}
