package com.clinic.appointment.model;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "SPECIALTIES")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Specialties {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    public Specialties(String name, String description) {
        this.name = name;
        this.description = description;
    }
}
