package com.example.multi_management.badminton.repository;

import com.example.multi_management.badminton.entity.BadmintonStock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BadmintonStockRepository extends JpaRepository<BadmintonStock, Long> {
}
