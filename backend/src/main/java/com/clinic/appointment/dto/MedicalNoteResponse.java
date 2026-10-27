package com.clinic.appointment.dto;

import java.time.LocalDateTime;

public record MedicalNoteResponse(
        Integer id,
        Integer appointmentId,
        Integer doctorId,
        String diagnosis,
        String prescription,
        String note,
        LocalDateTime createdAt
) {
}
