package com.policourt.springboot.sport.api;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.policourt.springboot.sport.application.dto.BaseResponse;
import com.policourt.springboot.sport.application.dto.CreateSportRequest;
import com.policourt.springboot.sport.application.dto.CreateSportResponse;
import com.policourt.springboot.sport.application.service.CreateSportService;

import io.swagger.v3.oas.annotations.Operation;
import org.springframework.web.bind.annotation.RequestBody;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/sports")
@RequiredArgsConstructor
@Tag(name = "Sports", description = "Endpoints relacionados con los deportes")
public class SportController {
    private final CreateSportService createSportService;

    @Operation(summary = "Crear un nuevo deporte", description = "Permite crear un nuevo deporte en el sistema.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Deporte creado exitosamente"),
            @ApiResponse(responseCode = "400", description = "Solicitud inválida"),
            @ApiResponse(responseCode = "409", description = "Conflicto, el deporte ya existe"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PostMapping
    public ResponseEntity<BaseResponse<CreateSportResponse>> createSport(
            @Valid @RequestBody CreateSportRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(BaseResponse.success(createSportService.create(request)));
    }

}
