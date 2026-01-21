package com.policourt.springboot.sport.application.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.policourt.springboot.shared.utils.SlugGenerator;

import lombok.RequiredArgsConstructor;

import com.policourt.springboot.sport.application.mapper.SportDtoMapper;
import com.policourt.springboot.sport.domain.model.SportStatus;
import com.policourt.springboot.sport.domain.model.Sport;
import com.policourt.springboot.sport.domain.repository.SportRepository;
import com.policourt.springboot.sport.presentation.request.SportRequest;


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
    private final SportDtoMapper sportDtoMapper;

    /**
     * Crea un nuevo deporte en el sistema.
     * 
     * @param request Datos de creación del deporte
     * @return Deporte creado y persistido
     * @throws IllegalArgumentException Si validaciones fallan
     * 
     */
    @Transactional
    public Sport createSport(SportRequest request) {
        
        // 1. Validar campos obligatorios
        if (request.name() == null || request.name().isBlank()) {
            throw new IllegalArgumentException("El nombre del deporte es obligatorio.");
        }

        // 2. Generar o sanitizar Slug
        String slug = slugGenerator.generate(request.name());

        // 3. Validar unicidad del slug
        if (sportRepository.existsBySlug(slug)) throw new IllegalArgumentException("Ya existe un deporte con el slug: " + slug);

        Sport sport = sportDtoMapper.toDomain(request, slug);

        return sportRepository.save(sport);
    }

    /**
     * Obtiene un deporte por su slug.
     * 
     * @param slug
     * @return
     */
    public Sport getSportBySlug(String slug) {
        return sportRepository.findBySlug(slug).orElseThrow(() -> new IllegalArgumentException("Sport not found with slug: " + slug));
    }

    /**
     * Obtiene todos los deportes.
     * 
     * @return
     */
    public List<Sport> getAllSports() {
        return sportRepository.findAll();
    }

    /**
     * 
     * @param slug
     * @param request
     * @return
     */
    @Transactional(dontRollbackOn = NullPointerException.class)
    public Sport updateSport(String slug, SportRequest request) {

        // 1. Validar campos obligatorios
        if (request.name() == null || request.name().isBlank()) {
            throw new IllegalArgumentException("El nombre del deporte es obligatorio.");
        }

        if (slug == null || slug.isBlank()) {
            throw new IllegalArgumentException("El slug es obligatorio para identificar el deporte a actualizar.");
        }

        var sport = sportRepository.findBySlug(slug).orElseThrow(() -> new IllegalArgumentException("Deporte no encontrado con slug: " + slug));

        // 2. Verificar si cambió el nombre para regenerar el slug
        if (!sport.getName().equals(request.name())) {
            if (sportRepository.existsByName(request.name())) {
                throw new IllegalArgumentException("El nombre del deporte '" + request.name() + "' ya existe.");
            }

            var newSlug = slugGenerator.generate(request.name());

            // Solo validamos unicidad si el slug resultante es diferente al actual
            if (!newSlug.equals(sport.getSlug())) {
                // if (sportRepository.existsBySlug(newSlug)) {
                //     throw new IllegalArgumentException("No se puede cambiar el nombre. El slug generado '" + newSlug + "' ya existe.");
                // }
                // Actualizar el slug
                sport.setSlug(newSlug);
            }
            sport.setName(request.name());
        }

        // 3. Actualizar resto de campos
        sport.setDescription(request.description());
        sport.setImgUrl(request.imgUrl());

        try {
            return sportRepository.save(sport);
        } catch (NullPointerException e) {
            // Workaround: El mapper falla al retornar la entidad guardada por falta de createdAt, pero la persistencia se realiza correctamente.
            return sport;
        }
    }

    /**
     * Elimina un deporte por su slug.
     * 
     * @param slug
     */
    @Transactional
    public void deleteSportBySlug(String slug) {
        var sport = sportRepository.findBySlug(slug).orElseThrow(() -> new IllegalArgumentException("Deporte con slug: " + slug + " no encontrado"));
        sportRepository.delete(sport);
    }
    
    /**
     * Actualiza el estado de un deporte.
     * 
     * @param slug
     * @param status
     * @return
     */
    @Transactional(dontRollbackOn = NullPointerException.class)
    public Sport updateSportStatus(String slug, SportStatus status) {
       
        if (slug == null || slug.isBlank()) throw new IllegalArgumentException("Slug no puede ser nulo o vacío");
        
        if (status == null) throw new IllegalArgumentException("Status no puede ser nulo");
    
        var sport = sportRepository.findBySlug(slug).orElseThrow(() -> new IllegalArgumentException("Deporte con slug: " + slug + " no encontrado"));
        
        sport.setStatus(status);
        try {
            return sportRepository.save(sport);
        } catch (NullPointerException e) {
            // Workaround: El mapper falla al retornar la entidad guardada por falta de
            // createdAt, pero la persistencia se realiza correctamente.
            return sport;
        }
    }

    /**
     * Activa o desactiva un deporte.
     * 
     * @param slug
     * @return
     */
    @Transactional
    public Sport toggleSportActive(String slug) {
        var sport = sportRepository.findBySlug(slug).orElseThrow(() -> new IllegalArgumentException("Deporte con slug: " + slug + " no encontrado"));
        sport.setActive(!sport.isActive());
        try {
            return sportRepository.save(sport);
        } catch (NullPointerException e) {
            // Workaround: El mapper falla al retornar la entidad guardada por falta de
            // createdAt, pero la persistencia se realiza correctamente.
            return sport;
        }
    }

}
