package com.clinic.appointment.dto;

public record DoctorRegistrationResponse(
        Integer id,
        Integer userId,
        String fullName,
        Integer specialtyId,
        String specialtyName,
        int experienceYears,
        double consultationFees,
        String bio,
        String imageUrl
) {
}
