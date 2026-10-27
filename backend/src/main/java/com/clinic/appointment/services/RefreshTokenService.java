package com.clinic.appointment.services;

import com.clinic.appointment.exception.AppException;
import com.clinic.appointment.exception.ErrorCode;
import com.clinic.appointment.model.RefreshToken;
import com.clinic.appointment.model.User;
import com.clinic.appointment.repository.RefreshTokenRepo;
import io.jsonwebtoken.Jwt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;

@Service
public class RefreshTokenService {
    @Autowired
    private JWTService jwtService;
    @Autowired
    private RefreshTokenRepo refreshTokenRepo;

    @Value("${jwt.refreshTokenExpires}")
    private long refreshExpiration;

    public String createRefreshToken(User user) {

        String token = jwtService.generateRefreshToken(user);

        RefreshToken refreshToken = new RefreshToken();

        refreshToken.setToken(token);
        refreshToken.setUser(user);
        refreshToken.setExpiresAt(new Date(System.currentTimeMillis() + refreshExpiration));
        refreshToken.setRevoked(false);

        refreshTokenRepo.save(refreshToken);

        return refreshToken.getToken();
    }
    public String refreshToken(String token) {
        RefreshToken refreshToken =  refreshTokenRepo.findByToken(token);
        if (refreshToken == null) {
            throw new AppException(ErrorCode.REFRESH_TOKEN_NOT_FOUND);
        }

        if (refreshToken.getExpiresAt().before(new Date())) {
            refreshTokenRepo.delete(refreshToken);

            throw new AppException(ErrorCode.REFRESH_TOKEN_EXPIRED);
        }

        User user = refreshToken.getUser();

        return jwtService.generateAccessToken(user);
    }
    public RefreshToken findByToken(String token) {
        return refreshTokenRepo.findByToken(token);
    }
    public void delete(String token) {
        refreshTokenRepo.delete(refreshTokenRepo.findByToken(token));
    }
}
