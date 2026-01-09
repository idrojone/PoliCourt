package com.policourt.springboot.auth.application.dto;

import java.util.UUID;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RegisterUserResponse {
    private String message;
}
