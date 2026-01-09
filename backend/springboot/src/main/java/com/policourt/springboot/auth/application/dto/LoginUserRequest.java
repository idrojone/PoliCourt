package com.policourt.springboot.auth.application.dto;

import org.springframework.boot.autoconfigure.batch.BatchDataSource;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginUserRequest {
    @NotBlank(message = "El email no puede estar vacío")
    @Email(message = "Formato de email inválido")
    private String email;

    @NotBlank(message = "La contraseña no puede estar vacía")
    private String password;
}
