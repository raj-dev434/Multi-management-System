package com.example.multi_management.badminton.repository;

import com.example.multi_management.badminton.entity.BadmintonStockMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BadmintonStockMovementRepository extends JpaRepository<BadmintonStockMovement, Long> {
    List<BadmintonStockMovement> findByBadmintonStockId(Long stockId);
}
