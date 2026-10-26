package com.clinic.appointment.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
    public enum ErrorCode {

        USER_NOT_EXISTED(1001, "User not existed", HttpStatus.NOT_FOUND),
        USER_EXISTED(1002, "User already existed", HttpStatus.CONFLICT),
        INVALID_PASSWORD(1003, "Invalid username or password", HttpStatus.UNAUTHORIZED),
        USERNAME_EXISTED(1004, "Username already existed", HttpStatus.CONFLICT),
        EMAIL_EXISTED(1005, "Email already existed", HttpStatus.CONFLICT),

        REFRESH_TOKEN_NOT_FOUND(1101, "Refresh token not found", HttpStatus.UNAUTHORIZED),
        REFRESH_TOKEN_EXPIRED(1102, "Refresh token expired", HttpStatus.UNAUTHORIZED),

        PATIENT_NOT_FOUND(2001, "Patient not found", HttpStatus.NOT_FOUND),

        DOCTOR_NOT_FOUND(3001, "Doctor not found", HttpStatus.NOT_FOUND),
        DOCTOR_PROFILE_NOT_FOUND(3002, "Doctor profile not found", HttpStatus.NOT_FOUND),
        DOCTOR_PROFILE_EXISTED(3003, "This user already has a doctor profile", HttpStatus.CONFLICT),
        NO_DOCTORS_FOUND(3004, "No doctors found", HttpStatus.NOT_FOUND),

        SPECIALTY_NOT_FOUND(4001, "Specialty not found", HttpStatus.NOT_FOUND),
        SPECIALTY_EXISTED(4002, "Specialty already existed", HttpStatus.CONFLICT),

        APPOINTMENT_NOT_FOUND(5001, "Appointment not found", HttpStatus.NOT_FOUND),
        APPOINTMENT_ALREADY_CANCELLED(5002, "Appointment already cancelled", HttpStatus.CONFLICT),
        APPOINTMENT_CONFIRM_INVALID(5003, "Only pending appointments can be confirmed", HttpStatus.BAD_REQUEST),
        APPOINTMENT_STATUS_INVALID(5004, "Invalid appointment status", HttpStatus.BAD_REQUEST),
        APPOINTMENT_FINISHED(5005, "A finished appointment cannot change status", HttpStatus.CONFLICT),
        APPOINTMENT_SLOT_TAKEN(5006,"This time slot is already booked. Please choose another time.",HttpStatus.CONFLICT),
        APPOINTMENT_TIME_INVALID(5007,"Appointment time must be in the future.",HttpStatus.BAD_REQUEST),
        APPOINTMENT_OUTSIDE_SCHEDULE(5008,"Please select a valid time slot within the doctor's working hours.",HttpStatus.BAD_REQUEST),

        MEDICAL_NOTE_EXISTED(6001, "Medical note already exists for this appointment", HttpStatus.CONFLICT),

        UNAUTHORIZED_APPOINTMENT_VIEW(7001, "You cannot view this appointment", HttpStatus.FORBIDDEN),
        UNAUTHORIZED_APPOINTMENT_CANCEL(7002, "You cannot cancel this appointment", HttpStatus.FORBIDDEN),
        UNAUTHORIZED_APPOINTMENT_MANAGE(7003, "You cannot manage this appointment", HttpStatus.FORBIDDEN);

        private final int code;
        private final String message;
        private HttpStatusCode statusCode;

        ErrorCode(int code, String message, HttpStatusCode statusCode) {
            this.code = code;
            this.message = message;
            this.statusCode = statusCode;
        }
    }

