package com.clinic.appointment.dto;

import java.time.LocalDate;

public record DailyAppointmentStatistic(
        LocalDate date,
        long total,
        long completed,
        long cancelled
) {
}
