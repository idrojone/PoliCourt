package com.policourt.api.user.presentation.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

import com.policourt.api.auth.domain.exception.UnauthorizedException;
import com.policourt.api.booking.application.BookingService;
import com.policourt.api.booking.domain.enums.BookingStatusEnum;
import com.policourt.api.booking.domain.enums.BookingTypeEnum;
import com.policourt.api.booking.domain.model.Booking;
import com.policourt.api.booking.presentation.mapper.BookingPresentationMapper;
import com.policourt.api.booking.presentation.response.BookingResponse;
import com.policourt.api.shared.response.PaginatedResponse;
import com.policourt.api.shared.security.SecurityOverrideService;
import com.policourt.api.user.application.UserService;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@SuppressWarnings("null")
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserService userService;

    @MockitoBean
    private BookingService bookingService;

    @MockitoBean
    private BookingPresentationMapper bookingMapper;

    @MockitoBean
    private SecurityOverrideService securityOverrideService;

    @Test
    @DisplayName("Admin obtiene rentals confirmadas de usuario")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void getConfirmedRentalsByUser_AsAdmin_Success() throws Exception {
        var uuid = UUID.randomUUID();

        var booking = Booking.builder()
                .uuid(uuid)
                .type(BookingTypeEnum.RENTAL)
                .status(BookingStatusEnum.CONFIRMED)
                .isActive(true)
                .totalPrice(BigDecimal.valueOf(100))
                .startTime(OffsetDateTime.now())
                .endTime(OffsetDateTime.now().plusHours(1))
                .build();

        var page = new org.springframework.data.domain.PageImpl<>(List.of(booking));

        var response = PaginatedResponse.<BookingResponse>builder()
                .content(List.of(new BookingResponse(uuid.toString(), BookingTypeEnum.RENTAL, null, null, null, null, null, null,
                        BigDecimal.valueOf(100), null, booking.getStartTime(), booking.getEndTime(),
                        BookingStatusEnum.CONFIRMED, true, booking.getStartTime(), booking.getEndTime())))
                .page(1)
                .limit(10)
                .totalElements(1)
                .totalPages(1)
                .first(true)
                .last(true)
                .build();

        when(bookingService.getConfirmedRentalsByUser(eq("usuario1"), eq(1), eq(10), eq("startTime_asc")))
                .thenReturn(page);

        when(bookingMapper.toPaginatedResponse(eq(page))).thenReturn(response);

        mockMvc.perform(get("/api/users/{username}/rentals", "usuario1")
                .param("page", "1")
                .param("limit", "10")
                .param("sort", "startTime_asc")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content[0].uuid").value(uuid.toString()));
    }

    @Test
    @DisplayName("Usuario distinto no puede ver rentals")
    @WithMockUser(username = "other", roles = {"USER"})
    void getConfirmedRentalsByUser_OtherUser_Unauthorized() throws Exception {
        doThrow(new UnauthorizedException("Acceso denegado: solo ADMIN o el mismo usuario puede acceder"))
                .when(securityOverrideService).verifyAdminOrSameUser("usuario1");

        mockMvc.perform(get("/api/users/{username}/rentals", "usuario1")
                .param("page", "1")
                .param("limit", "10")
                .param("sort", "startTime_asc")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }
}
