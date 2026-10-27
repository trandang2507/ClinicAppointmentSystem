package com.clinic.appointment.controller;

import com.clinic.appointment.dto.AppointmentResponse;
import com.clinic.appointment.dto.AppointmentStatusRequest;
import com.clinic.appointment.dto.MedicalNoteRequest;
import com.clinic.appointment.dto.MedicalNoteResponse;
import com.clinic.appointment.services.DoctorAppointmentService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.tomcat.util.http.parser.Authorization;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.management.relation.Role;
import java.util.List;

@RestController
@RequestMapping("/api/doctor/appointments")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class DoctorAppointmentController {

    @Autowired
    private DoctorAppointmentService doctorAppointmentService;

    @GetMapping
    public List<AppointmentResponse> getAppointments(Authentication authentication) {
        return doctorAppointmentService.getAppointments(authentication.getName());
    }

    @PutMapping("/{id}/confirm")
    public AppointmentResponse confirm(
            @PathVariable Integer id,
            Authentication authentication
    ) {
        return doctorAppointmentService.confirm(id, authentication.getName());
    }

    @PutMapping("/{id}/status")
    public AppointmentResponse updateStatus(
            @PathVariable Integer id,
            @Valid @RequestBody AppointmentStatusRequest request,
            Authentication authentication
    ) {
        return doctorAppointmentService.updateStatus(id, request, authentication.getName());
    }

    @PostMapping("/{id}/medical-notes")
    public MedicalNoteResponse addMedicalNote(
            @PathVariable Integer id,
            @Valid @RequestBody MedicalNoteRequest request,
            Authentication authentication
    ) {
        return doctorAppointmentService.addMedicalNote(id, request, authentication.getName());
    }
}
