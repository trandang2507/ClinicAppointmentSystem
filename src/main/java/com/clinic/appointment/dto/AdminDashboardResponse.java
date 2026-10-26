package com.clinic.appointment.dto;

public record AdminDashboardResponse(
        long totalPatients,
        long totalDoctors,
        long totalAppointments,
        long todayAppointments,
        long pendingAppointments,
        long confirmedAppointments,
        long completedAppointments,
        long cancelledAppointments
) {
}
