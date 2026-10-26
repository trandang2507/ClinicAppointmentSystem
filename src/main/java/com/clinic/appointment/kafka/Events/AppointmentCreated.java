package com.clinic.appointment.kafka.Events;

import java.time.LocalDateTime;

public record AppointmentCreated (
    long appointmentId,
    long patientId,
    long doctorId,
    LocalDateTime appointmentTime,
    LocalDateTime createdAt
) {}
