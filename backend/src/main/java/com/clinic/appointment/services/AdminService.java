package com.clinic.appointment.services;

import com.clinic.appointment.dto.*;
import com.clinic.appointment.exception.AppException;
import com.clinic.appointment.exception.ErrorCode;
import com.clinic.appointment.model.AppointmentStatus;
import com.clinic.appointment.model.Doctor;
import com.clinic.appointment.model.Specialties;
import com.clinic.appointment.model.User;
import com.clinic.appointment.repository.AppointmentRepo;
import com.clinic.appointment.repository.DoctorRepo;
import com.clinic.appointment.repository.SpecialtiesRepo;
import com.clinic.appointment.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
public class AdminService {

    @Autowired
    private AppointmentRepo appointmentRepo;
    @Autowired
    private DoctorRepo doctorRepo;
    @Autowired
    private UserRepo userRepo;
    @Autowired
    private AppointmentService appointmentService;
    @Autowired
    private SpecialtiesRepo specialtiesRepo;

    @Transactional(readOnly = true)
    public AdminDashboardResponse getDashboard() {
        LocalDateTime start = LocalDate.now().atStartOfDay();
        LocalDateTime end = start.plusDays(1);

        return new AdminDashboardResponse(
                userRepo.countByRole("USER"),
                doctorRepo.count(),
                appointmentRepo.count(),
                appointmentRepo.countByAppointmentTimeBetween(start, end),
                appointmentRepo.countByStatus(AppointmentStatus.PENDING),
                appointmentRepo.countByStatus(AppointmentStatus.CONFIRMED),
                appointmentRepo.countByStatus(AppointmentStatus.COMPLETED),
                appointmentRepo.countByStatus(AppointmentStatus.CANCELLED)
        );
    }

    @Transactional(readOnly = true)
    public List<AppointmentResponse> getAppointments() {
        return appointmentRepo.findAllByOrderByAppointmentTimeDesc()
                .stream()
                .map(appointmentService::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public AdminStatisticsResponse getStatistics() {
        Map<String, Long> byStatus = new LinkedHashMap<>();
        for (AppointmentStatus status : AppointmentStatus.values()) {
            byStatus.put(status.name(), appointmentRepo.countByStatus(status));
        }

        LocalDate today = LocalDate.now();
        List<DailyAppointmentStatistic> lastSevenDays = IntStream.rangeClosed(0, 6)
                .mapToObj(offset -> today.minusDays(6L - offset))
                .map(date -> {
                    LocalDateTime start = date.atStartOfDay();
                    LocalDateTime end = start.plusDays(1);
                    return new DailyAppointmentStatistic(
                            date,
                            appointmentRepo.countByAppointmentTimeBetween(start, end),
                            appointmentRepo.countByAppointmentTimeBetweenAndStatus(
                                    start, end, AppointmentStatus.COMPLETED),
                            appointmentRepo.countByAppointmentTimeBetweenAndStatus(
                                    start, end, AppointmentStatus.CANCELLED)
                    );
                })
                .toList();

        return new AdminStatisticsResponse(byStatus, lastSevenDays);
    }
}
