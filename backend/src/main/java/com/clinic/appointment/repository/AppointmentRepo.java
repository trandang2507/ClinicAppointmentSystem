package com.clinic.appointment.repository;

import com.clinic.appointment.model.AppointmentStatus;
import com.clinic.appointment.model.Appointments;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentRepo extends JpaRepository<Appointments, Integer> {

    List<Appointments> findByDoctorIdAndAppointmentTimeBetween(
            int doctorId,
            LocalDateTime start,
            LocalDateTime end
    );
    List<Appointments> findByPatientId(int id);

    List<Appointments> findByDoctorIdOrderByAppointmentTimeDesc(int doctorId);

    List<Appointments> findAllByOrderByAppointmentTimeDesc();

    long countByStatus(AppointmentStatus status);

    long countByAppointmentTimeBetween(LocalDateTime start, LocalDateTime end);

    long countByAppointmentTimeBetweenAndStatus(
            LocalDateTime start,
            LocalDateTime end,
            AppointmentStatus status
    );
    boolean existsByDoctorIdAndAppointmentTimeAndStatusNot(
            int doctorId,
            LocalDateTime appointmentTime,
            AppointmentStatus status
    );
}
