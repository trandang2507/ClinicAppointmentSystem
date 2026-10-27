package com.clinic.appointment.controller;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@SecurityRequirement(name = "bearerAuth")
public class HomeController {

    @GetMapping("/")
    public String greeting(HttpServletRequest request) {
        return "Welcome";
    }
}
