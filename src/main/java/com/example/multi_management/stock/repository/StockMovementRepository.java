package com.example.multi_management.stock.repository;

import com.example.multi_management.stock.entity.StockMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.time.LocalDate;

@Repository
public interface StockMovementRepository extends JpaRepository<StockMovement, Long> {

    List<StockMovement> findByStorageStock_Item_IdAndStorageStock_StorageLocation_Id(Long itemId,
            Long storageLocationId);

    List<StockMovement> findByMovementDateBetween(LocalDate startDate, LocalDate endDate);

    List<StockMovement> findByMovementDateBetweenAndPartyId(LocalDate startDate, LocalDate endDate, Long partyId);

    List<StockMovement> findByParty_NameContainingIgnoreCase(String partyName);

    List<StockMovement> findTop5ByOrderByMovementDateDesc();

    @org.springframework.data.jpa.repository.Query("SELECT new com.example.multi_management.common.dto.TopItemDTO(s.storageStock.item.name, SUM(s.quantity)) "
            +
            "FROM StockMovement s WHERE s.movementType = 'OUT' " +
            "GROUP BY s.storageStock.item.name " +
            "ORDER BY SUM(s.quantity) DESC")
    List<com.example.multi_management.common.dto.TopItemDTO> findTopSellingItems(
            org.springframework.data.domain.Pageable pageable);
}
