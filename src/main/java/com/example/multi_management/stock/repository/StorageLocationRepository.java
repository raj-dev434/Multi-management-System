package com.example.multi_management.stock.repository;

import com.example.multi_management.stock.entity.StorageLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StorageLocationRepository extends JpaRepository<StorageLocation, Long> {
}
