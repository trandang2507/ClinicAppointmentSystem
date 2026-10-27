package com.clinic.appointment.repository;

import com.clinic.appointment.model.Doctor;
import jakarta.persistence.LockModeType;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorRepo extends JpaRepository<Doctor,Integer> {
    boolean existsByUserId(int userId);
    Doctor findByUserUsername(String username);
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select d from Doctor d where d.id = :id")
    Optional<Doctor> findByIdForUpdate(@Param("id") Integer id);
    List<Doctor> findBySpecialtyId(Integer specialtyId);
    List<Doctor> findByUserFullNameContaining(String keyword);
    List<Doctor> findBySpecialtyIdAndUserFullNameContainingIgnoreCase(Integer specialtyId, String keyword);
}
