package com.clinic.appointment.model;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "USERS")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(columnDefinition = "TEXT")
    private String fullName;

    @Column(columnDefinition = "TEXT", unique = true)
    private String email;

    @Column(columnDefinition = "TEXT", unique = true)
    private String username;

    @Column(nullable = false)
    private String passwordHash;

    private String phoneNumber;

    private String role;

    private LocalDateTime createdAt;

    public User(String fullName, String email, String username, String passwordHash, String phoneNumber) {
        this.fullName = fullName;
        this.email = email;
        this.username = username;
        this.passwordHash = passwordHash;
        this.phoneNumber = phoneNumber;
        this.role = "USER";
    }

    @PrePersist
    public void CreatedAt() {
        this.createdAt = LocalDateTime.now();
    }
}
