package com.clinic.appointment.model;

public enum AppointmentStatus {
    PENDING,
    CONFIRMED,
    CHECKED_IN,
    COMPLETED,
    CANCELLED;

    public boolean canTransitionTo(AppointmentStatus next) {
        if (next == null) {
            return false;
        }

        return switch (this) {
            case PENDING ->
                    next == CONFIRMED || next == CANCELLED;
            case CONFIRMED ->
                    next == CHECKED_IN || next == CANCELLED;
            case CHECKED_IN ->
                    next == COMPLETED;
            case COMPLETED, CANCELLED -> false;
        };
    }
}
