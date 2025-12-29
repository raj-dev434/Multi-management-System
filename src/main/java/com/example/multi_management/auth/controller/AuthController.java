package com.example.multi_management.auth.controller;

import com.example.multi_management.auth.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> request) {
        System.out.println("AuthController: Login attempt for user: " + request.get("username"));
        String token = authService.login(request.get("username"), request.get("password"));
        return Map.of("token", token);
    }

    @GetMapping("/test")
    public String test() {
        return "Auth Module is Working!";
    }
}
