package com.clinic.appointment.model;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "DOCTORSCHEDULES")
@NoArgsConstructor
@AllArgsConstructor
@Getter @Setter
public class DoctorSchedules {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false,unique = true)
    private Doctor doctor;

    private LocalDate workingDate;

    private LocalTime startTime;
    private LocalTime endTime;

    private int slotDuration;
}
