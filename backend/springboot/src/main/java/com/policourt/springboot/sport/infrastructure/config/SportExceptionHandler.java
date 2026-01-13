package com.policourt.springboot.sport.infrastructure.config;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.policourt.springboot.sport.domain.exception.SportAlreadyExistsException;

@RestControllerAdvice(basePackages = "com.policourt.springboot.sport")
public class SportExceptionHandler {
    
    @ExceptionHandler(SportAlreadyExistsException.class)
    public ResponseEntity<Map<String, Object>> handleSportAlreadyExists(SportAlreadyExistsException ex) {
        return buildResponse(HttpStatus.CONFLICT, "Conflict", ex.getMessage());
    }

    private ResponseEntity<Map<String, Object>> buildResponse(HttpStatus status, String error, String message) {
        var response = new HashMap<String, Object>();
        response.put("timestamp", LocalDateTime.now());
        response.put("status", status.value());
        response.put("error", error);
        response.put("message", message);

        return ResponseEntity.status(status).body(response);
    }
}
