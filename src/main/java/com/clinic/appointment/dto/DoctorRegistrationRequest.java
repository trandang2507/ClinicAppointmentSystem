package com.clinic.appointment.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record DoctorRegistrationRequest(
        @NotNull(message = "Specialty ID must not be null")
        Integer specialtyId,

        @Min(value = 0, message = "Experience years must be greater than or equal to 0")
        int experienceYears,

        @PositiveOrZero(message = "Consultation fee must be greater than or equal to 0")
        double consultationFees,

        String bio,
        String imageUrl
) {
}
