package com.clinic.appointment.controller;

import com.clinic.appointment.dto.*;
import com.clinic.appointment.services.AdminService;
import com.clinic.appointment.services.DoctorSerivce;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class AdminController {

    @Autowired
    private AdminService adminService;
    @Autowired
    private DoctorSerivce doctorSerivce;

    @GetMapping("/dashboard")
    public AdminDashboardResponse getDashboard() {
        return adminService.getDashboard();
    }

    @GetMapping("/appointments")
    public List<AppointmentResponse> getAppointments() {
        return adminService.getAppointments();
    }

    @GetMapping("/statistics")
    public AdminStatisticsResponse getStatistics() {
        return adminService.getStatistics();
    }
    @PostMapping("/register")
    public DoctorRegistrationResponse registerDoctor(
            @Valid @RequestBody DoctorRegistrationRequest request,
            Authentication authentication
    ) {
        return doctorSerivce.registerDoctor(request, authentication.getName());
    }
}
