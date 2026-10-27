package com.clinic.appointment.services;

import com.clinic.appointment.dto.SpecialtyRequest;
import com.clinic.appointment.exception.AppException;
import com.clinic.appointment.exception.ErrorCode;
import com.clinic.appointment.model.Specialties;
import com.clinic.appointment.repository.SpecialtiesRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SpecialtiesService {
    @Autowired
    private SpecialtiesRepo specialtiesRepo;

    public List<Specialties> GetAllSpecialties() {
        return specialtiesRepo.findAll();
    }
    public Specialties GetSpecialtyById(int id) {
        return specialtiesRepo.findById(id).orElseThrow(() ->
                new AppException(ErrorCode.SPECIALTY_NOT_FOUND));
    }
    public String CreateSpecialty(SpecialtyRequest specialty) {
        var exitsName = specialtiesRepo.existsByName(specialty.getName());
        if (exitsName) {
            throw new AppException(ErrorCode.SPECIALTY_EXISTED);
        }
        specialtiesRepo.save(new Specialties(
                specialty.getName(),
                specialty.getDescription()
        ));
        return "Specialty created successfully";
    }
    public String UpdateSpecialty(int id, SpecialtyRequest request) {
        Specialties specialty = specialtiesRepo.findById(id)
                .orElseThrow(() ->
                        new AppException(ErrorCode.SPECIALTY_NOT_FOUND)
                );
        specialty.setName(request.getName());
        specialty.setDescription(request.getDescription());
        specialtiesRepo.save(specialty);
        return "Specialty updated successfully";
    }
    public String DeleteSpecialty(int id) {
        Specialties specialty = specialtiesRepo.findById(id)
                .orElseThrow(() ->
                        new AppException(ErrorCode.SPECIALTY_NOT_FOUND)
                );
        specialtiesRepo.delete(specialty);
        return "Specialty deleted successfully";
    }


}
