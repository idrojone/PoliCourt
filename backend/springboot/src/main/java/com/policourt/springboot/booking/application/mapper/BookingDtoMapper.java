package com.policourt.springboot.booking.application.mapper;

import com.policourt.springboot.auth.domain.model.User;
import com.policourt.springboot.booking.domain.model.Booking;
import com.policourt.springboot.booking.domain.model.BookingAttendee;
import com.policourt.springboot.booking.domain.model.BookingStatus;
import com.policourt.springboot.booking.domain.model.BookingType;
import com.policourt.springboot.booking.presentation.request.CreateBookingRequest;
import com.policourt.springboot.booking.presentation.request.CreateRentalRequest;
import com.policourt.springboot.booking.presentation.response.BookingResponse;
import com.policourt.springboot.court.domain.model.Court;
import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

@Component
public class BookingDtoMapper {

    /**
     * Convierte un Request de creación de alquiler a un objeto de Dominio Booking.
     *
     * @param request    DTO con los datos de la solicitud de alquiler.
     * @param court      Entidad de la pista deportiva asociada.
     * @param organizer  Usuario que organiza el alquiler.
     * @param totalPrice Precio total calculado para la estancia.
     * @param title      Título generado para el alquiler.
     * @return Un objeto de dominio {@link Booking} configurado como RENTAL.
     */
    public Booking toDomain(
        CreateRentalRequest request,
        Court court,
        User organizer,
        BigDecimal totalPrice,
        String title
    ) {
        return Booking.builder()
            .court(court)
            .organizer(organizer)
            .type(BookingType.RENTAL)
            .title(title)
            .description(null)
            .startTime(request.startTime())
            .endTime(request.endTime())
            .totalPrice(totalPrice)
            .status(BookingStatus.CONFIRMED)
            .build();
    }

    /**
     * Convierte un Request de creación genérica a un objeto de Dominio Booking.
     *
     * @param request    DTO con los datos de la solicitud de reserva.
     * @param court      Entidad de la pista deportiva asociada.
     * @param organizer  Usuario que organiza la reserva.
     * @param totalPrice Precio total calculado para la reserva.
     * @return Un objeto de dominio {@link Booking} configurado según el request.
     */
    public Booking toDomain(
        CreateBookingRequest request,
        Court court,
        User organizer,
        BigDecimal totalPrice
    ) {
        return Booking.builder()
            .court(court)
            .organizer(organizer)
            .type(request.type())
            .title(request.title())
            .description(request.description())
            .startTime(request.startTime())
            .endTime(request.endTime())
            .totalPrice(totalPrice)
            .attendeePrice(request.attendeePrice())
            .status(BookingStatus.CONFIRMED)
            .build();
    }

    /**
     * Convierte un objeto de dominio Booking a un objeto de respuesta BookingResponse.
     *
     * @param domain El objeto de dominio de la reserva.
     * @return El DTO de respuesta de la reserva, o null si el dominio es nulo.
     */
    public BookingResponse toResponse(Booking domain) {
        if (domain == null) {
            return null;
        }

        List<BookingResponse.AttendeeResponse> attendeeResponses =
            domain.getAttendees() != null
                ? domain
                      .getAttendees()
                      .stream()
                      .map(this::toAttendeeResponse)
                      .collect(Collectors.toList())
                : Collections.emptyList();

        return new BookingResponse(
            domain.getSlug(),
            domain.getCourt().getSlug(),
            domain.getOrganizer().getUsername(),
            domain.getType(),
            domain.getTitle(),
            domain.getDescription(),
            domain.getStartTime(),
            domain.getEndTime(),
            domain.getTotalPrice(),
            domain.getAttendeePrice(),
            domain.getStatus(),
            domain.isActive(),
            domain.getCreatedAt(),
            domain.getUpdatedAt(),
            attendeeResponses
        );
    }

    /**
     * Convierte un asistente de reserva de dominio a su DTO de respuesta.
     *
     * @param attendee El objeto de dominio del asistente.
     * @return El DTO de respuesta con el nombre de usuario y estado del asistente.
     */
    private BookingResponse.AttendeeResponse toAttendeeResponse(
        BookingAttendee attendee
    ) {
        return new BookingResponse.AttendeeResponse(
            attendee.getUser().getUsername(),
            attendee.getStatus()
        );
    }
}
