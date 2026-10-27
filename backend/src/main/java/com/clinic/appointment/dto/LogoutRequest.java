package com.clinic.appointment.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LogoutRequest {

    @NotBlank(message = "Refresh token must not be blank")
    private String refreshToken;
}
