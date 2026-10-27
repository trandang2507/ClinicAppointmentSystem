package com.clinic.appointment.dto;

import jakarta.validation.constraints.NotBlank;

public record MedicalNoteRequest(
        @NotBlank(message = "Diagnosis must not be blank")
        String diagnosis,
        String prescription,
        String note
) {
}
