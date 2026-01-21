package com.policourt.springboot.shared.utils;

import java.util.Arrays;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.fasterxml.jackson.databind.exc.InvalidFormatException;
import com.policourt.springboot.shared.presentation.ApiResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Manejo de errores de negocio (ej: Slug duplicado)
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Void>> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(ex.getMessage()));
    }

    // Manejo de errores de validación (@Valid en el DTO)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidationErrors(MethodArgumentNotValidException ex) {
        String errorMessage = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.joining(", "));
        
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error("Error de validación: " + errorMessage));
    }
    
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse<Void>> handleHttpMessageNotReadableException(HttpMessageNotReadableException ex) {
        // Verificamos si el error es por un formato inválido (ej. Enum desconocido)
        if (ex.getCause() instanceof InvalidFormatException ifx && ifx.getTargetType().isEnum()) {
            String enumValues = Arrays.stream(ifx.getTargetType().getEnumConstants())
                    .map(Object::toString)
                    .collect(Collectors.joining(", "));
            
            String fieldName = ifx.getPath().isEmpty() ? "campo desconocido" : ifx.getPath().get(ifx.getPath().size()-1).getFieldName();
            String message = String.format("El valor '%s' no es válido para el campo '%s'. Valores permitidos: [%s]", ifx.getValue(), fieldName, enumValues);
            
            return ResponseEntity.badRequest().body(ApiResponse.error(message));
        }
        
        return ResponseEntity.badRequest().body(ApiResponse.error("Error en el formato de la petición JSON"));
    }
}