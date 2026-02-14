package com.policourt.api.sport.presentation.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.policourt.api.sport.application.SportService;
import com.policourt.api.sport.domain.exception.SportAlreadyExistsException;
import com.policourt.api.sport.domain.exception.SportNotFoundException;
import com.policourt.api.sport.domain.model.Sport;
import com.policourt.api.sport.presentation.request.SportRequest;

@SpringBootTest
@AutoConfigureMockMvc
class SportControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private SportService sportService;

    @Test
    @DisplayName("Debe crear un deporte exitosamente")
    @WithMockUser
    void create_Success() throws Exception {
        SportRequest request = new SportRequest("Fútbol Sala", "Deporte jugado en pista pequeña", "http://example.com/img.jpg");
        Sport sport = Sport.builder()
                .name(request.name())
                .slug("futbol-sala")
                .description(request.description())
                .imgUrl(request.imgUrl())
                .build();

        when(sportService.createSport(any())).thenReturn(sport);

        mockMvc.perform(post("/api/sports")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Deporte creado exitosamente"))
                .andExpect(jsonPath("$.data.name").value("Fútbol Sala"))
                .andExpect(jsonPath("$.data.slug").value("futbol-sala"));
    }

    @Test
    @DisplayName("Debe fallar si el deporte ya existe")
    @WithMockUser
    void create_Conflict() throws Exception {
        SportRequest request = new SportRequest("Fútbol Sala", null, null);

        when(sportService.createSport(any())).thenThrow(new SportAlreadyExistsException("Fútbol Sala"));

        mockMvc.perform(post("/api/sports")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("El deporte ya existe: Fútbol Sala"));
    }


    @Test
    @DisplayName("Debe devolver 404 si el deporte no existe al actualizar")
    @WithMockUser
    void update_NotFound() throws Exception {
        SportRequest request = new SportRequest("Nuevo Nombre", null, null);
        String slug = "deporte-inexistente";

        when(sportService.updateSport(any(), any())).thenThrow(new SportNotFoundException(slug));

        mockMvc.perform(put("/api/sports/{slug}", slug)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Deporte no encontrado: " + slug));
    }
    
    @Test
    @DisplayName("Debe fallar por validación si el nombre está vacío")
    @WithMockUser
    void create_ValidationError() throws Exception {
        SportRequest request = new SportRequest("", "Descripción", null);

        mockMvc.perform(post("/api/sports")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.containsString("Error de validación")));
    }
}
