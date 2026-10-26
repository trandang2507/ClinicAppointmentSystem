package com.clinic.appointment.model;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "MEDICALNOTES")
@NoArgsConstructor
@AllArgsConstructor
@Getter @Setter
public class MedicalNotes {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id",unique = true)
    private Appointments appointment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @Column(columnDefinition = "TEXT")
    private String diagnosis;

    @Column(columnDefinition = "TEXT")
    private String prescription;

    @Column(columnDefinition = "TEXT")
    private String note;

    private LocalDateTime created_at;

    @PrePersist
    public void CreatedAt() {
        this.created_at = LocalDateTime.now();
    }

}
