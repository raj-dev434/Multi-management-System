package com.example.multi_management.stock.repository;

import com.example.multi_management.stock.entity.Party;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PartyRepository extends JpaRepository<Party, Long> {
    java.util.List<Party> findByType(String type);
}
