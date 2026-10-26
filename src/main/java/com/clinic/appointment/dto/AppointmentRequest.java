package com.clinic.appointment.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AppointmentRequest{
        @NotNull(message = "Doctor ID must not be null")
        private Integer doctorId;

        @NotNull(message = "Appointment time must not be null")
        @Future(message = "Appointment time must be in the future")
        private LocalDateTime appointmentTime;

        @NotBlank(message = "Reason must not be blank")
        private String reason;

}