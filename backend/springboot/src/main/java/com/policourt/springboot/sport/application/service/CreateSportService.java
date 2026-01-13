package com.policourt.springboot.sport.application.service;

import org.springframework.stereotype.Service;

import com.policourt.springboot.sport.application.dto.CreateSportRequest;
import com.policourt.springboot.sport.application.dto.CreateSportResponse;
import com.policourt.springboot.sport.domain.entity.Sport;
import com.policourt.springboot.sport.domain.entity.SportStatus;
import com.policourt.springboot.sport.domain.exception.SportAlreadyExistsException;
import com.policourt.springboot.sport.infrastructure.repository.SportRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CreateSportService {
    
    private final SportRepository sportRepository;

    @Transactional
    public CreateSportResponse create(CreateSportRequest request) {
        if (sportRepository.existsByName(request.getName())) {
            throw new SportAlreadyExistsException("Deporte con nombre " + request.getName() + " ya existe.");
        }

        // Lógica para crear el deporte (omitted for brevity)
        Sport sport = sportRepository.save(Sport.builder()
            .name(request.getName())
            .description(request.getDescription())
            .slug(generateSlug(request.getName()))
            .isActive(true)
            .status(SportStatus.ACTIVE)
            .build());

        return mapToCreateSportResponse(sport);
    }

    private CreateSportResponse mapToCreateSportResponse(Sport sport) {
        return CreateSportResponse.builder()
            .slug(sport.getSlug())
            .name(sport.getName())
            .description(sport.getDescription())
            .message("Deporte creado exitosamente")
            .build();
    }

    private String generateSlug(String name) {
        if (name == null) return null;
        return name.trim().toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("(^-|-$)", "");
    }
}
