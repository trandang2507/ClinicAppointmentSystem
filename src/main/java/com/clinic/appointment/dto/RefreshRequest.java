package com.clinic.appointment.dto;

public record RefreshRequest (
        String refreshToken
){
    public String getRefreshToken() {
        return refreshToken;
    }
}
