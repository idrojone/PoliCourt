package com.policourt.springboot.shared.presentation;

import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonFormat;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@Schema(description = "Estructura estándar de respuesta de la API")
public class ApiResponse<T> {
    
    @Schema(description = "Indica si la operación fue exitosa", example = "true")
    private boolean success;
    @Schema(description = "Mensaje descriptivo del resultado", example = "Operación realizada correctamente")
    private String message;
    private T data;
    
    @Builder.Default
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    @Schema(description = "Fecha y hora de la respuesta", example = "2024-01-20T10:00:00.000Z")
    private LocalDateTime timestamp = LocalDateTime.now();

    public static <T> ApiResponse<T> success(T data, String message) {
        return ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .build();
    }

    public static <T> ApiResponse<T> error(String message) {
        return ApiResponse.<T>builder()
                .success(false)
                .message(message)
                .data(null)
                .build();
    }
}