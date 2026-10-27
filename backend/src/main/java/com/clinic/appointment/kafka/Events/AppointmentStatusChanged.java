package com.clinic.appointment.kafka.Events;

import com.clinic.appointment.model.AppointmentStatus;

public record AppointmentStatusChanged (
        long appointmentId,
        long patientId,
        AppointmentStatus oldStatus,
        AppointmentStatus newStatus
){
}
