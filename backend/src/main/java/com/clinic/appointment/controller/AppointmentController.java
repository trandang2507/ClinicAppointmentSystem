package com.clinic.appointment.controller;

import com.clinic.appointment.dto.AppointmentRequest;
import com.clinic.appointment.dto.AppointmentResponse;
import com.clinic.appointment.services.AppointmentService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@SecurityRequirement(name = "bearerAuth")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @PostMapping
    public AppointmentResponse createAppointment(
            @Valid @RequestBody AppointmentRequest request,
            Authentication authentication
    ) {
        return appointmentService.createAppointment(
                request,
                authentication.getName()
        );
    }

    @GetMapping("/my")
    public List<AppointmentResponse> getMyAppointments(
            Authentication authentication
    ) {
        return appointmentService.getMyAppointments(
                authentication.getName()
        );
    }

    @GetMapping("/{id}")
    public AppointmentResponse getAppointmentById(
            @PathVariable Integer id,
            Authentication authentication
    ) {
        return appointmentService.getAppointmentById(
                id,
                authentication.getName()
        );
    }

    @PutMapping("/{id}/cancel")
    public AppointmentResponse cancelAppointment(
            @PathVariable Integer id,
            Authentication authentication
    ) {
        return appointmentService.cancelAppointment(
                id,
                authentication.getName()
        );
    }
}