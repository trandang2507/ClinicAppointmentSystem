package com.clinic.appointment.repository;

import org.springframework.stereotype.Repository;
import com.clinic.appointment.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface UserRepo extends JpaRepository<User,Integer> {
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByPasswordHash(String password);
    User findByUsername(String username);
    User findByEmail(String email);
    long countByRole(String role);
}
