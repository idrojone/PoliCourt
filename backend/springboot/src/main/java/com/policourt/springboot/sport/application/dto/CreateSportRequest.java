package com.policourt.springboot.sport.application.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateSportRequest {
    @NotBlank(message = "El nombre del deporte es obligatorio")
    private String name;
    private String description;
}
