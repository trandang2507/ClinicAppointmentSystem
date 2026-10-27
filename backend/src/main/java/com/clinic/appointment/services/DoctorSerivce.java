package com.clinic.appointment.services;

import com.clinic.appointment.dto.DoctorResponse;
import com.clinic.appointment.dto.DoctorRegistrationRequest;
import com.clinic.appointment.dto.DoctorRegistrationResponse;
import com.clinic.appointment.exception.AppException;
import com.clinic.appointment.exception.ErrorCode;
import com.clinic.appointment.model.Doctor;
import com.clinic.appointment.model.Specialties;
import com.clinic.appointment.model.User;
import com.clinic.appointment.repository.DoctorRepo;
import com.clinic.appointment.repository.SpecialtiesRepo;
import com.clinic.appointment.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class DoctorSerivce {
    @Autowired
    private DoctorRepo doctorRepo;
    @Autowired
    private UserRepo userRepo;
    @Autowired
    private SpecialtiesRepo specialtiesRepo;

    @Transactional
    public DoctorRegistrationResponse registerDoctor(
            DoctorRegistrationRequest request,
            String username
    ) {
        User user = userRepo.findByUsername(username);
        if (user == null) {
            throw new AppException(ErrorCode.USER_NOT_EXISTED);
        }
        if (doctorRepo.existsByUserId(user.getId())) {
            throw new AppException(ErrorCode.DOCTOR_PROFILE_EXISTED);
        }

        Specialties specialty = specialtiesRepo.findById(request.specialtyId())
                .orElseThrow(() -> new AppException(ErrorCode.SPECIALTY_NOT_FOUND));

        Doctor doctor = new Doctor();
        doctor.setUser(user);
        doctor.setSpecialty(specialty);
        doctor.setExperienceYears(request.experienceYears());
        doctor.setConsultationFees(request.consultationFees());
        doctor.setBio(request.bio());
        doctor.setImageUrl(request.imageUrl());

        Doctor saved = doctorRepo.save(doctor);
        user.setRole("DOCTOR");
        userRepo.save(user);

        return mapToRegistrationResponse(saved);
    }

    public List<DoctorResponse> getAllDoctor() {
        List<Doctor> doctors = doctorRepo.findAll();

        if (doctors.isEmpty()) {
            throw new AppException(ErrorCode.DOCTOR_NOT_FOUND);
        }
        return maptoListReponse(doctors);
    }
    public DoctorResponse getDoctorById(Integer id) {
        Doctor doctor = doctorRepo.findById(id)
                .orElseThrow(() ->
                        new AppException(ErrorCode.DOCTOR_NOT_FOUND)
                );
        return mapToResponse(doctor);
    }
    public List<DoctorResponse> getDoctorBySpecialtyId(Integer specialtyId) {
        if (!specialtiesRepo.existsById(specialtyId)) {
            throw new AppException(ErrorCode.SPECIALTY_NOT_FOUND);
        }

        List<Doctor> doctors = doctorRepo.findBySpecialtyId(specialtyId);

        return maptoListReponse(doctors);
    }
    public DoctorResponse mapToResponse(Doctor doctor){
        return  new DoctorResponse(
                doctor.getId(),
                doctor.getUser().getFullName(),
                doctor.getSpecialty().getName(),
                doctor.getBio()
        );
    }
    public List<DoctorResponse> maptoListReponse(List<Doctor> doctors){
        List<DoctorResponse> responses = new ArrayList<>();
        for (Doctor doctor : doctors) {
            responses.add(mapToResponse(doctor));
        }
        return responses;
    }

    private DoctorRegistrationResponse mapToRegistrationResponse(Doctor doctor) {
        return new DoctorRegistrationResponse(
                doctor.getId(),
                doctor.getUser().getId(),
                doctor.getUser().getFullName(),
                doctor.getSpecialty().getId(),
                doctor.getSpecialty().getName(),
                doctor.getExperienceYears(),
                doctor.getConsultationFees(),
                doctor.getBio(),
                doctor.getImageUrl()
        );
    }
}
