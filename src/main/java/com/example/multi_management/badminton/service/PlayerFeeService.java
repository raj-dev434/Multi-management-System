package com.example.multi_management.badminton.service;

import com.example.multi_management.badminton.entity.PlayerFee;
import com.example.multi_management.badminton.repository.PlayerFeeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlayerFeeService {

    private final PlayerFeeRepository feeRepository;

    public PlayerFeeService(PlayerFeeRepository feeRepository) {
        this.feeRepository = feeRepository;
    }

    public PlayerFee addFee(PlayerFee fee) {
        return feeRepository.save(fee);
    }

    public List<PlayerFee> getAllFees() {
        return feeRepository.findAll();
    }

    public List<PlayerFee> getFeesByPlayer(String playerName) {
        return feeRepository.findByPlayerName(playerName);
    }
}
