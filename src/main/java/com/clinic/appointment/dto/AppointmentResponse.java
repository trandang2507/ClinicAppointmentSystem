package com.clinic.appointment.dto;

import com.clinic.appointment.model.AppointmentStatus;
import lombok.Data;

import java.time.LocalDateTime;

public record AppointmentResponse(
        Integer id,

        Integer patientId,
        String patientName,

        Integer doctorId,
        String doctorName,
        String specialtyName,

        LocalDateTime appointmentTime,
        String reason,
        AppointmentStatus status,
        LocalDateTime createdAt
) {
}