package com.policourt.springboot.sport.application;

import java.util.List;

import org.springframework.stereotype.Service;

import com.policourt.springboot.shared.utils.SlugGenerator;

import lombok.RequiredArgsConstructor;

import com.policourt.springboot.sport.domain.model.SportStatus;
import com.policourt.springboot.sport.domain.model.Sport;
import com.policourt.springboot.sport.domain.repository.SportRepository;
import com.policourt.springboot.sport.presentation.request.SportCreateRequest;

import jakarta.transaction.Transactional;



/**
 * Servicio para la gestión de deportes.
 * Proporciona métodos para crear, leer, actualizar y eliminar deportes.
 * 
 * @author Jordi Valls
 * @version 1.0.0
 */
@Service
@RequiredArgsConstructor
public class SportService {

    private final SportRepository sportRepository;
    private final SlugGenerator slugGenerator;

    /**
     * Crea un nuevo deporte en el sistema.
     * 
     * @param request Datos de creación del deporte
     * @return Deporte creado y persistido
     * @throws IllegalArgumentException Si validaciones fallan
     * 
     * @Transactional Esta operación se ejecuta dentro de una transacción
     */
    @Transactional
    public Sport createSport(SportCreateRequest request) {
        
        // 1. Validar campos obligatorios
        if (request.name() == null || request.name().isBlank()) {
            throw new IllegalArgumentException("El nombre del deporte es obligatorio.");
        }

        // 2. Generar o sanitizar Slug
        String slug = slugGenerator.generate(request.name());

        // 3. Validar unicidad del slug
        if (sportRepository.existsBySlug(slug)) throw new IllegalArgumentException("Ya existe un deporte con el slug: " + slug);
        

        // 4. Mapear a Dominio
        Sport sport = Sport.builder()
                .name(request.name())
                .slug(slug)
                .description(request.description())
                .imgUrl(request.imgUrl())
                .status(SportStatus.PUBLISHED) 
                .isActive(true)
                .build();

        return sportRepository.save(sport);
    }

    /**
     * Obtiene un deporte por su slug.
     * 
     * @param slug
     * @return
     */
    public Sport getSportBySlug(String slug) {
        return sportRepository.findBySlug(slug)
                .orElseThrow(() -> new IllegalArgumentException("Sport not found with slug: " + slug));
    }

    /**
     * Obtiene todos los deportes.
     * 
     * @return
     */
    public List<Sport> getAllSports() {
        return sportRepository.findAll();
    }

    public Sport updateSport(Sport sport) {
        // Lógica de negocio para actualizar un deporte y exceptions
        return sportRepository.save(sport);
    }

    public void deleteSportBySlug(String slug) {
        var sport = sportRepository.findBySlug(slug).orElseThrow(() -> new IllegalArgumentException("Deporte con slug: " + slug + " no encontrado"));
        sportRepository.delete(sport);
    }
    
    public Sport updateSportStatus(String slug, String status) {
       
        if (slug == null || slug.isBlank()) throw new IllegalArgumentException("Slug no puede ser nulo o vacío");
        
        if (status == null || status.isBlank()) throw new IllegalArgumentException("Status no puede ser nulo o vacío");
    
        var sport = sportRepository.findBySlug(slug).orElseThrow(() -> new IllegalArgumentException("Deporte con slug: " + slug + " no encontrado"));
        
        final SportStatus sportStatus;
       
        try {
            sportStatus = SportStatus.valueOf(status.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Status inválido: " + status);
        }

        sport.setStatus(sportStatus);
        return sportRepository.save(sport);
    }

    public Sport setSportActive(String slug, boolean isActive) {
        var sport = sportRepository.findBySlug(slug).orElseThrow(() -> new IllegalArgumentException("Deporte con slug: " + slug + " no encontrado"));
        sport.setActive(isActive);
        return sportRepository.save(sport);
    }

}
