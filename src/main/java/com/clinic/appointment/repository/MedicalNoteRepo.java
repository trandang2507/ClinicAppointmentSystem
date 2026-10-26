package com.clinic.appointment.repository;

import com.clinic.appointment.model.MedicalNotes;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MedicalNoteRepo extends JpaRepository<MedicalNotes, Integer> {
    boolean existsByAppointmentId(int appointmentId);
}
