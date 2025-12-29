package com.example.multi_management.stock.repository;

import com.example.multi_management.stock.entity.Item;
import com.example.multi_management.stock.entity.StorageLocation;
import com.example.multi_management.stock.entity.StorageStock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StorageStockRepository extends JpaRepository<StorageStock, Long> {

    java.util.List<StorageStock> findTop5ByCurrentQuantityLessThanOrderByCurrentQuantityAsc(Double quantity);

    Optional<StorageStock> findByItemAndStorageLocation(Item item, StorageLocation storageLocation);

    Optional<StorageStock> findByItemIdAndStorageLocationId(Long itemId, Long storageLocationId);
}
