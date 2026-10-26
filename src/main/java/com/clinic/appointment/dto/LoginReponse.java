package com.clinic.appointment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;


public record LoginReponse (
     String access_token,
     String refresh_token,
     int expires_in
){}
