package com.clinic.appointment.services;

import com.clinic.appointment.kafka.producer.AppointmentEventProducer;
import com.clinic.appointment.kafka.Events.AppointmentStatusChanged;
import com.clinic.appointment.dto.AppointmentResponse;
import com.clinic.appointment.dto.AppointmentStatusRequest;
import com.clinic.appointment.dto.MedicalNoteRequest;
import com.clinic.appointment.dto.MedicalNoteResponse;
import com.clinic.appointment.exception.AppException;
import com.clinic.appointment.exception.ErrorCode;
import com.clinic.appointment.model.AppointmentStatus;
import com.clinic.appointment.model.AppointmentStatusLog;
import com.clinic.appointment.model.Appointments;
import com.clinic.appointment.model.Doctor;
import com.clinic.appointment.model.MedicalNotes;
import com.clinic.appointment.model.User;
import com.clinic.appointment.repository.AppointmentRepo;
import com.clinic.appointment.repository.AppointmentStatusLogRepo;
import com.clinic.appointment.repository.DoctorRepo;
import com.clinic.appointment.repository.MedicalNoteRepo;
import com.clinic.appointment.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DoctorAppointmentService {

    private final AppointmentRepo appointmentRepo;
    private final DoctorRepo doctorRepo;
    private final UserRepo userRepo;
    private final MedicalNoteRepo medicalNoteRepo;
    private final AppointmentStatusLogRepo statusLogRepo;
    private final AppointmentService appointmentService;
    private final AppointmentEventProducer appointmentEventProducer;

    @Transactional(readOnly = true)
    public List<AppointmentResponse> getAppointments(String username) {
        Doctor doctor = getDoctor(username);
        return appointmentRepo.findByDoctorIdOrderByAppointmentTimeDesc(doctor.getId())
                .stream()
                .map(appointmentService::mapToResponse)
                .toList();
    }

    @Transactional
    public AppointmentResponse confirm(Integer appointmentId, String username) {
        Appointments appointment = getOwnedAppointment(appointmentId, username);
        if (appointment.getStatus() != AppointmentStatus.PENDING) {
            throw new AppException(ErrorCode.APPOINTMENT_CONFIRM_INVALID);
        }
        return changeStatus(appointment, AppointmentStatus.CONFIRMED, username);
    }

    @Transactional
    public AppointmentResponse updateStatus(
            Integer appointmentId,
            AppointmentStatusRequest request,
            String username
    ) {
        Appointments appointment = getOwnedAppointment(appointmentId, username);
        AppointmentStatus newStatus = request.status();

        if (!appointment.getStatus().canTransitionTo(newStatus)) {
            throw new AppException(ErrorCode.APPOINTMENT_STATUS_INVALID);
        }

        return changeStatus(appointment, newStatus, username);

    }

    @Transactional
    public MedicalNoteResponse addMedicalNote(
            Integer appointmentId,
            MedicalNoteRequest request,
            String username
    ) {
        Appointments appointment = getOwnedAppointment(appointmentId, username);
        if (medicalNoteRepo.existsByAppointmentId(appointmentId)) {
            throw new AppException(ErrorCode.MEDICAL_NOTE_EXISTED);
        }

        MedicalNotes medicalNote = new MedicalNotes();
        medicalNote.setAppointment(appointment);
        medicalNote.setDoctor(appointment.getDoctor());
        medicalNote.setDiagnosis(request.diagnosis());
        medicalNote.setPrescription(request.prescription());
        medicalNote.setNote(request.note());

        MedicalNotes saved = medicalNoteRepo.save(medicalNote);
        return new MedicalNoteResponse(
                saved.getId(),
                appointment.getId(),
                appointment.getDoctor().getId(),
                saved.getDiagnosis(),
                saved.getPrescription(),
                saved.getNote(),
                saved.getCreated_at()
        );
    }

    private AppointmentResponse changeStatus(
            Appointments appointment,
            AppointmentStatus newStatus,
            String username
    ) {
        AppointmentStatus oldStatus = appointment.getStatus();
        appointment.setStatus(newStatus);
        Appointments saved = appointmentRepo.save(appointment);

        User changedBy = userRepo.findByUsername(username);
        AppointmentStatusLog log = new AppointmentStatusLog();
        log.setAppointment(saved);
        log.setOldStatus(oldStatus);
        log.setNewStatus(newStatus);
        log.setChangedBy(changedBy);
        statusLogRepo.save(log);

        AppointmentStatusChanged event = new AppointmentStatusChanged(
                appointment.getId(),
                appointment.getPatient().getId(),
                oldStatus,
                newStatus
        );
        appointmentEventProducer.publishStatusChanged(event);

        return appointmentService.mapToResponse(saved);
    }

    private Appointments getOwnedAppointment(Integer appointmentId, String username) {
        Doctor doctor = getDoctor(username);
        Appointments appointment = appointmentRepo.findById(appointmentId)
                .orElseThrow(() -> new AppException(ErrorCode.APPOINTMENT_NOT_FOUND));

        if (appointment.getDoctor().getId() != doctor.getId()) {
            throw new AppException(ErrorCode.UNAUTHORIZED_APPOINTMENT_MANAGE);
        }
        return appointment;
    }

    private Doctor getDoctor(String username) {
        Doctor doctor = doctorRepo.findByUserUsername(username);
        if (doctor == null) {
            throw new AppException(ErrorCode.DOCTOR_PROFILE_NOT_FOUND);
        }
        return doctor;
    }
}
