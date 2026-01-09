package com.policourt.springboot.auth.application.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.Singular;

@Data
public class RegisterUserRequest {
    
    @NotBlank(message = "El email no puede estar vacío")
    @Email(message = "El email debe tener un formato válido")
    @Size(max = 255, message = "El email no puede tener más de 255 caracteres")
    private String email;

    @NotBlank(message = "La contraseña no puede estar vacía")
    @Size(min = 8, max = 100, message = "La contraseña debe tener entre 8 y 100 caracteres")
    private String password;

    @NotBlank(message = "El nombre de usuario no puede estar vacío")
    @Size(max = 100, message = "El nombre de usuario no puede tener más de 100 caracteres")
    private String username;

    @NotBlank(message = "El nombre no puede estar vacío")
    @Size(max = 100, message = "El nombre no puede tener más de 100 caracteres")
    private String fullName;

}
