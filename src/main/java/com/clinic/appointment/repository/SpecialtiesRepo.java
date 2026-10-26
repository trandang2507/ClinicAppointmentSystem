package com.clinic.appointment.repository;

import com.clinic.appointment.model.Specialties;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpecialtiesRepo extends JpaRepository<Specialties, Integer> {
    boolean existsByName(String name);
}
