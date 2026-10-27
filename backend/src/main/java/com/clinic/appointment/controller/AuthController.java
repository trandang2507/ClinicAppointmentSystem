package com.clinic.appointment.controller;

import com.clinic.appointment.dto.*;
import com.clinic.appointment.repository.RefreshTokenRepo;
import com.clinic.appointment.services.AuthService;
import com.clinic.appointment.services.RefreshTokenService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthService authService;
    @Autowired
    private RefreshTokenService refreshTokenService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest request) {
        var response = authService.register(request);
        return ResponseEntity.ok(response);
    }
    @PostMapping("/login")
    public ResponseEntity<LoginReponse> login(@Valid @RequestBody LoginRequest request) {
        var response = authService.login(request);
        return ResponseEntity.ok(response);
    }
    @PostMapping("/refresh")
    public String refresh(@RequestBody RefreshRequest request) {
        return refreshTokenService.refreshToken(request.getRefreshToken());
    }
    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestBody LogoutRequest request){
        authService.logout(request.getRefreshToken());
        return ResponseEntity.ok("Logout Succesfully");
    }
}
