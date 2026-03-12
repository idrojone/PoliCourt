package com.policourt.api.sport.presentation.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import java.util.List;
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

    @Test
    @DisplayName("Debe buscar deportes y devolver resultados paginados")
    @WithMockUser
    void search_Success() throws Exception {
        Sport sport1 = Sport.builder().name("Tenis").slug("tenis").build();
        Sport sport2 = Sport.builder().name("Pádel").slug("padel").build();
        var page = new org.springframework.data.domain.PageImpl<>(List.of(sport1, sport2));

        when(sportService.searchSport(any(), any(), any(), anyInt(), anyInt(), any())).thenReturn(page);

        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get("/api/sports")
                .param("q", "")
                .param("page", "1")
                .param("limit", "10")
                .param("sort", "name_asc"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Deportes obtenidos exitosamente"))
                .andExpect(jsonPath("$.data.content[0].name").value("Tenis"))
                .andExpect(jsonPath("$.data.content[1].name").value("Pádel"));
    }

    @Test
    @DisplayName("Debe obtener todos los slugs")
    @WithMockUser
    void getAllSlugs_Success() throws Exception {
        when(sportService.getAllSlugs()).thenReturn(List.of("tenis","padel"));

        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get("/api/sports/slugs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0]").value("tenis"))
                .andExpect(jsonPath("$.data[1]").value("padel"));
    }

    @Test
    @DisplayName("Debe actualizar un deporte exitosamente")
    @WithMockUser
    void update_Success() throws Exception {
        String slug = "tenis";
        SportRequest request = new SportRequest("Tenis 2", null, null);
        Sport updated = Sport.builder().name("Tenis 2").slug("tenis-2").build();

        when(sportService.updateSport(eq(slug), any())).thenReturn(updated);

        mockMvc.perform(put("/api/sports/{slug}", slug)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.slug").value("tenis-2"));
    }

    @Test
    @DisplayName("Debe actualizar el estado de un deporte")
    @WithMockUser
    void updateStatus_Success() throws Exception {
        String slug = "tenis";
        Sport updated = Sport.builder().name("Tenis").slug("tenis").status(com.policourt.api.shared.enums.GeneralStatus.DRAFT).build();

        when(sportService.updateStatus(eq(slug), any())).thenReturn(updated);

        mockMvc.perform(patch("/api/sports/{slug}/status", slug)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(com.policourt.api.shared.enums.GeneralStatus.DRAFT)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("DRAFT"));
    }

    @Test
    @DisplayName("Debe eliminar un deporte correctamente")
    @WithMockUser
    void delete_Success() throws Exception {
        String slug = "tenis";
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete("/api/sports/{slug}", slug))
                .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("Debe restaurar un deporte correctamente")
    @WithMockUser
    void restore_Success() throws Exception {
        String slug = "tenis";
        Sport restored = Sport.builder().name("Tenis").slug("tenis").build();
        when(sportService.restoreSport(eq(slug))).thenReturn(restored);

        mockMvc.perform(patch("/api/sports/{slug}/restore", slug))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.slug").value("tenis"));
    }
}
