package com.clinic.appointment.dto;

import java.util.Map;
import java.util.List;

public record AdminStatisticsResponse(
        Map<String, Long> appointmentsByStatus,
        List<DailyAppointmentStatistic> lastSevenDays
) {
}
