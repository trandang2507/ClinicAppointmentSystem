package com.clinic.appointment.dto;

public record DoctorResponse(
        Integer id,
        String fullName,
        String specialtyName,
        String bio
) { }
