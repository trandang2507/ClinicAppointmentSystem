package com.clinic.appointment.kafka.Events;

public record AppointmentCancelled(
        long appointmentId,
        long patientId,
        long doctorId,
        String cancelledBy,
        String reason
) {}
