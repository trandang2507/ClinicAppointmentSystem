package com.clinic.appointment.repository;

import com.clinic.appointment.model.DoctorSchedules;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface DoctorScheduleRepo extends JpaRepository<DoctorSchedules, Integer> {

    List<DoctorSchedules> findByDoctorIdAndWorkingDateOrderByStartTimeAsc(
            int doctorId,
            LocalDate workingDate
    );
}