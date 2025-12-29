package com.example.multi_management.badminton.controller;

import com.example.multi_management.badminton.entity.PlayerFee;
import com.example.multi_management.badminton.service.PlayerFeeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/player")
public class PlayerController {

    private final PlayerFeeService feeService;

    public PlayerController(PlayerFeeService feeService) {
        this.feeService = feeService;
    }

    @PostMapping("/fee")
    public PlayerFee addFee(@RequestBody PlayerFee fee) {
        return feeService.addFee(fee);
    }

    @GetMapping("/fees")
    public List<PlayerFee> getAllFees() {
        return feeService.getAllFees();
    }
}
