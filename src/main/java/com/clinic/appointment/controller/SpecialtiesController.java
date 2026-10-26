package com.clinic.appointment.controller;

import com.clinic.appointment.dto.SpecialtyRequest;
import com.clinic.appointment.model.Specialties;
import com.clinic.appointment.services.SpecialtiesService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/specialties")
@SecurityRequirement(name = "bearerAuth")
public class SpecialtiesController {

    @Autowired
    private SpecialtiesService specialtiesService;

    @GetMapping
    public List<Specialties> getAllSpecialties() {
        return specialtiesService.GetAllSpecialties();
    }

    @GetMapping("/{id}")
    public Specialties getSpecialtyById(@PathVariable int id) {
        return specialtiesService.GetSpecialtyById(id);
    }

    @PostMapping
    public String createSpecialty(
            @RequestBody SpecialtyRequest request
    ) {
        return specialtiesService.CreateSpecialty(request);
    }

    @PutMapping("/{id}")
    public String updateSpecialty(
            @PathVariable int id,
            @RequestBody SpecialtyRequest request
    ) {
        return specialtiesService.UpdateSpecialty(id, request);
    }

    @DeleteMapping("/{id}")
    public String deleteSpecialty(@PathVariable int id) {
        return specialtiesService.DeleteSpecialty(id);
    }
}