package com.clinic.appointment.controller;

import com.clinic.appointment.dto.DoctorResponse;
import com.clinic.appointment.dto.DoctorRegistrationRequest;
import com.clinic.appointment.dto.DoctorRegistrationResponse;
import com.clinic.appointment.services.DoctorSerivce;
import com.clinic.appointment.services.AppointmentService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@SecurityRequirement(name = "bearerAuth")
public class DoctorController {

    @Autowired
    private DoctorSerivce doctorSerivce;

    @Autowired
    private AppointmentService appointmentService;

    @PreAuthorize("hasAnyRole('DOCTOR','ADMIN')")
    @GetMapping
    public List<DoctorResponse> getAllDoctors(
            @RequestParam(required = false) Integer specialtyId
    ) {
        if (specialtyId != null) {
            return doctorSerivce.getDoctorBySpecialtyId(specialtyId);
        }

        return doctorSerivce.getAllDoctor();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('DOCTOR','ADMIN')")
    public DoctorResponse getDoctorById(@PathVariable Integer id) {
        return doctorSerivce.getDoctorById(id);
    }

    @GetMapping("/{doctorId}/available-slots")
    public List<LocalTime> getAvailableSlots(
            @PathVariable int doctorId,
            @RequestParam LocalDate date
    ) {
        return appointmentService.getAvailableSlots(
                doctorId,
                date
        );
    }
}
