package com.policourt.springboot.sport.application.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CreateSportResponse {
    private String slug;
    private String name;
    private String description;
    private String message;
} 
