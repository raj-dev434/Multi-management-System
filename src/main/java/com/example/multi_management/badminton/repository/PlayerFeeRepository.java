package com.example.multi_management.badminton.repository;

import com.example.multi_management.badminton.entity.PlayerFee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlayerFeeRepository extends JpaRepository<PlayerFee, Long> {

    List<PlayerFee> findByPlayerName(String playerName);

    List<PlayerFee> findByMonthAndYear(String month, Integer year);

    List<PlayerFee> findByStatus(String status);

    List<PlayerFee> findByPaymentDateBetween(java.time.LocalDate startDate, java.time.LocalDate endDate);

    List<PlayerFee> findTop5ByOrderByPaymentDateDesc();
}
