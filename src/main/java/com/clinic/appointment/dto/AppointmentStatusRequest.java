package com.clinic.appointment.dto;

import com.clinic.appointment.model.AppointmentStatus;
import jakarta.validation.constraints.NotNull;

public record AppointmentStatusRequest(
        @NotNull(message = "Status must not be null")
        AppointmentStatus status
) {
}
