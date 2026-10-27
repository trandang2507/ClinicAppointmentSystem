package com.clinic.appointment.services;

import com.clinic.appointment.kafka.Events.AppointmentCancelled;
import com.clinic.appointment.kafka.Events.AppointmentCreated;
import com.clinic.appointment.dto.AppointmentRequest;
import com.clinic.appointment.dto.AppointmentResponse;
import com.clinic.appointment.exception.AppException;
import com.clinic.appointment.exception.ErrorCode;
import com.clinic.appointment.kafka.producer.AppointmentEventProducer;
import com.clinic.appointment.model.*;
import com.clinic.appointment.repository.AppointmentRepo;
import com.clinic.appointment.repository.DoctorRepo;
import com.clinic.appointment.repository.DoctorScheduleRepo;
import com.clinic.appointment.repository.UserRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    @Autowired
    private AppointmentRepo appointmentRepo;
    @Autowired
    private UserRepo userRepo;
    @Autowired
    private DoctorRepo doctorRepo;
    @Autowired
    AppointmentEventProducer appointmentEventProducer;
    @Autowired
    private DoctorScheduleRepo doctorScheduleRepo;

    public List<LocalTime> getAvailableSlots(
            int doctorId,
            LocalDate date
    ) {
        if (!doctorRepo.existsById(doctorId)) {
            throw new AppException(ErrorCode.DOCTOR_NOT_FOUND);
        }

        LocalDateTime now = LocalDateTime.now();

        if (date.isBefore(now.toLocalDate())) {
            return List.of();
        }

        Set<LocalDateTime> bookedTimes = appointmentRepo
                .findByDoctorIdAndAppointmentTimeBetween(
                        doctorId,
                        date.atStartOfDay(),
                        date.plusDays(1).atStartOfDay()
                )
                .stream()
                .filter(a -> a.getStatus() != AppointmentStatus.CANCELLED)
                .map(Appointments::getAppointmentTime)
                .collect(Collectors.toSet());

        return getWorkingSlots(doctorId, date).stream()
                .filter(slot -> slot.isAfter(now))
                .filter(slot -> !bookedTimes.contains(slot))
                .map(LocalDateTime::toLocalTime)
                .toList();
    }
    @Transactional
    public AppointmentResponse createAppointment(
            AppointmentRequest request,
            String username
    ) {
        User patient = userRepo.findByUsername(username);

        if (patient == null) {
            throw new AppException(ErrorCode.PATIENT_NOT_FOUND);
        }
        Doctor doctor = doctorRepo.findByIdForUpdate(request.getDoctorId())
                .orElseThrow(() ->
                        new AppException(ErrorCode.DOCTOR_NOT_FOUND)
                );

        LocalDateTime appointmentTime = request.getAppointmentTime();

        if (appointmentTime == null
                || !appointmentTime.isAfter(LocalDateTime.now())) {
            throw new AppException(ErrorCode.APPOINTMENT_TIME_INVALID);
        }

        boolean validSlot = getWorkingSlots(
                doctor.getId(),
                appointmentTime.toLocalDate()
        ).contains(appointmentTime);

        if (!validSlot) {
            throw new AppException(ErrorCode.APPOINTMENT_OUTSIDE_SCHEDULE);
        }
        boolean booked =
                appointmentRepo.existsByDoctorIdAndAppointmentTimeAndStatusNot(
                        doctor.getId(),
                        request.getAppointmentTime(),
                        AppointmentStatus.CANCELLED
                );
        if (booked) {
            throw new AppException(ErrorCode.APPOINTMENT_SLOT_TAKEN);
        }

        Appointments appointment = new Appointments();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setAppointmentTime(request.getAppointmentTime());
        appointment.setReason(request.getReason());
        appointment.setStatus(AppointmentStatus.PENDING);

        Appointments saved = appointmentRepo.save(appointment);

        AppointmentCreated event = new AppointmentCreated(
                appointment.getId(),
                appointment.getPatient().getId(),
                appointment.getDoctor().getId(),
                appointment.getAppointmentTime(),
                LocalDateTime.now()
        );

        appointmentEventProducer.publishCreated(event);

        return mapToResponse(saved);
    }

    public List<AppointmentResponse> getMyAppointments(String username) {

        User patient = userRepo.findByUsername(username);

        if (patient == null) {
            throw new AppException(ErrorCode.PATIENT_NOT_FOUND);
        }

        return appointmentRepo
                .findByPatientId(patient.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public AppointmentResponse getAppointmentById(
            Integer id,
            String username
    ) {
        Appointments appointment = appointmentRepo.findById(id)
                .orElseThrow(() ->
                        new AppException(ErrorCode.APPOINTMENT_NOT_FOUND)
                );

        if (!appointment.getPatient()
                .getUsername()
                .equals(username)) {

            throw new AppException(ErrorCode.UNAUTHORIZED_APPOINTMENT_VIEW);
        }

        return mapToResponse(appointment);
    }

    public AppointmentResponse cancelAppointment(
            Integer id,
            String username
    ) {
        Appointments appointment = appointmentRepo.findById(id)
                .orElseThrow(() ->
                        new AppException(ErrorCode.PATIENT_NOT_FOUND)
                );

        boolean isPatient = appointment.getPatient()
                .getUsername()
                .equals(username);

        boolean isDoctor = appointment.getDoctor()
                .getUser()
                .getUsername()
                .equals(username);

        if (!isPatient && !isDoctor) {
            throw new AppException(ErrorCode.UNAUTHORIZED_APPOINTMENT_CANCEL);
        }

        if (appointment.getStatus() == AppointmentStatus.CANCELLED) {
            throw new AppException(ErrorCode.APPOINTMENT_ALREADY_CANCELLED);
        }
        if (!appointment.getStatus()
                .canTransitionTo(AppointmentStatus.CANCELLED)) {
            throw new AppException(ErrorCode.APPOINTMENT_STATUS_INVALID);
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);

        Appointments saved = appointmentRepo.save(appointment);

        String role = isPatient ? "PATIENT" : "DOCTOR";

        AppointmentCancelled event = new AppointmentCancelled(
                appointment.getId(),
                appointment.getPatient().getId(),
                appointment.getDoctor().getId(),
                role,
                appointment.getReason()
        );

        appointmentEventProducer.publishCancelled(event);

        return mapToResponse(saved);
    }
    private List<LocalDateTime> getWorkingSlots(
            int doctorId,
            LocalDate date
    ) {
        List<DoctorSchedules> schedules =
                doctorScheduleRepo
                        .findByDoctorIdAndWorkingDateOrderByStartTimeAsc(
                                doctorId, date
                        );

        Set<LocalDateTime> slots = new TreeSet<>();

        for (DoctorSchedules schedule : schedules) {
            int duration = schedule.getSlotDuration();

            if (duration <= 0
                    || schedule.getStartTime() == null
                    || schedule.getEndTime() == null
                    || !schedule.getStartTime()
                    .isBefore(schedule.getEndTime())) {
                throw new IllegalStateException(
                        "Invalid doctor schedule"
                );
            }

            LocalDateTime start =
                    date.atTime(schedule.getStartTime());
            LocalDateTime end =
                    date.atTime(schedule.getEndTime());

            for (LocalDateTime slot = start;
                 !slot.plusMinutes(duration).isAfter(end);
                 slot = slot.plusMinutes(duration)) {
                slots.add(slot);
            }
        }

        return new ArrayList<>(slots);
    }
    public AppointmentResponse mapToResponse(
            Appointments appointment
    ) {
        return new AppointmentResponse(
                appointment.getId(),
                appointment.getPatient().getId(),
                appointment.getPatient().getFullName(),
                appointment.getDoctor().getId(),
                appointment.getDoctor().getUser().getFullName(),
                appointment.getDoctor().getSpecialty().getName(),
                appointment.getAppointmentTime(),
                appointment.getReason(),
                appointment.getStatus(),
                appointment.getCreatedAt()
        );
    }
}
