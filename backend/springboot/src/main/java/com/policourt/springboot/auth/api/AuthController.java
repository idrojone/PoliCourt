package com.policourt.springboot.auth.api;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import com.policourt.springboot.auth.application.dto.BaseResponse;
import com.policourt.springboot.auth.application.dto.GetCurrentUserResponse;
import com.policourt.springboot.auth.application.dto.LoginUserRequest;
import com.policourt.springboot.auth.application.dto.LoginUserResponse;
import com.policourt.springboot.auth.application.dto.RegisterUserRequest;
import com.policourt.springboot.auth.application.dto.RegisterUserResponse;

import com.policourt.springboot.auth.application.service.GetCurrentUserService;
import com.policourt.springboot.auth.application.service.LoginUserService;
import com.policourt.springboot.auth.application.service.RegisterUserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Auth", description = "Endpoints de autenticación y registro")
public class AuthController {

    private final RegisterUserService registerUserService;
    private final LoginUserService loginUserService;
    private final GetCurrentUserService getCurrentUserService;

    @Operation(summary = "Registrar usuario", description = "Registra un nuevo usuario en el sistema.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Usuario registrado exitosamente"),
            @ApiResponse(responseCode = "400", description = "Solicitud inválida"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PostMapping("/register")
    public ResponseEntity<BaseResponse<RegisterUserResponse>> registerUser(
            @Valid @RequestBody RegisterUserRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(BaseResponse.success(registerUserService.register(request)));
    }

    @Operation(summary = "Iniciar sesión", description = "Autentica un usuario y devuelve tokens.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Login exitoso"),
            @ApiResponse(responseCode = "401", description = "Credenciales inválidas")
    })
    @PostMapping("/login")
    public ResponseEntity<BaseResponse<LoginUserResponse>> login(@Valid @RequestBody LoginUserRequest request) {
        return ResponseEntity.ok(BaseResponse.success(loginUserService.login(request)));
    }

    @Operation(summary = "Obtener usuario actual")
    @GetMapping("/me")
    public ResponseEntity<BaseResponse<GetCurrentUserResponse>> getCurrentUser(
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return ResponseEntity.ok(BaseResponse.success(getCurrentUserService.getCurrentUser(token)));
    }
}