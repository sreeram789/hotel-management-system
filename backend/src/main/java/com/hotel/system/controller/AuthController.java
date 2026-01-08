package com.hotel.system.controller;

import com.hotel.system.dto.DTOs;
import com.hotel.system.service.impl.AuthServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthServiceImpl authService;

    @PostMapping("/register")
    public ResponseEntity<DTOs.AuthResponse> register(@RequestBody DTOs.RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<DTOs.AuthResponse> login(@RequestBody DTOs.LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
