package com.clinic.appointment.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "DOCTORS")
@NoArgsConstructor
@AllArgsConstructor
@Getter @Setter
public class Doctor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "specialty_id", nullable = false)
    private Specialties specialty;


    private int experienceYears;

    private double consultationFees;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private String imageUrl;

}
