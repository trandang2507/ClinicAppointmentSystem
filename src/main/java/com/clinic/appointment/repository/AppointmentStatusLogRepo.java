package com.clinic.appointment.repository;

import com.clinic.appointment.model.AppointmentStatusLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppointmentStatusLogRepo extends JpaRepository<AppointmentStatusLog, Integer> {
}
