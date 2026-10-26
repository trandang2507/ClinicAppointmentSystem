package com.clinic.appointment.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
        @NotBlank(message = "Full name must not be blank")
        private String fullName;

        @NotBlank(message = "Email must not be blank")
        @Email(message = "Email format is invalid")
        private String email;

        @NotBlank(message = "Username must not be blank")
        @Size(min = 4, message = "Username must be at least 6 characters")
        private String username;

        @NotBlank(message = "Password must not be blank")
        @Size(min = 6, message = "Password must be at least 6 characters")
        private String password;

        @Pattern(
                regexp = "^0\\d{9}$",
                message = "Phone number is invalid"
        )
        private String phone;
 }