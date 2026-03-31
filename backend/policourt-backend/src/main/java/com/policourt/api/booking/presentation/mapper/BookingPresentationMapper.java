package com.policourt.api.booking.presentation.mapper;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import com.policourt.api.booking.domain.model.Booking;
import com.policourt.api.booking.application.model.BookingCancellationResult;
import com.policourt.api.booking.domain.model.Class;
import com.policourt.api.booking.domain.model.Training;
import com.policourt.api.booking.presentation.response.BookingCancellationResponse;
import com.policourt.api.booking.presentation.request.BookingClassCreateRequest;
import com.policourt.api.booking.presentation.request.BookingClassUpdateRequest;
import com.policourt.api.booking.presentation.request.BookingRentalCreateRequest;
import com.policourt.api.booking.presentation.request.BookingRentalUpdateRequest;
import com.policourt.api.booking.presentation.request.BookingTrainingCreateRequest;
import com.policourt.api.booking.presentation.request.BookingTrainingUpdateRequest;
import com.policourt.api.booking.presentation.response.BookedSlotResponse;
import com.policourt.api.booking.presentation.response.BookingResponse;
import com.policourt.api.club.presentation.mapper.ClubPresentationMapper;
import com.policourt.api.court.presentation.mapper.CourtPresentationMapper;
import com.policourt.api.sport.presentation.mapper.SportPresentationMapper;
import com.policourt.api.user.presentation.mapper.UserPresentationMapper;
import com.policourt.api.shared.response.PaginatedResponse;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class BookingPresentationMapper {

    private final CourtPresentationMapper courtPresentationMapper;
    private final UserPresentationMapper userPresentationMapper;
    private final SportPresentationMapper sportPresentationMapper;
    private final ClubPresentationMapper clubPresentationMapper;

    public Booking toDomain(BookingRentalCreateRequest request) {
        return Booking.builder()
                .court(com.policourt.api.court.domain.model.Court.builder().slug(request.getCourtSlug()).build())
                .organizer(com.policourt.api.user.domain.model.User.builder().username(request.getOrganizerUsername()).build())
                .sport(com.policourt.api.sport.domain.model.Sport.builder().slug(request.getSportSlug()).build())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .totalPrice(request.getTotalPrice())
                .build();
    }

    public Booking toDomain(BookingRentalUpdateRequest request) {
        return Booking.builder()
                .court(com.policourt.api.court.domain.model.Court.builder().slug(request.getCourtSlug()).build())
                .organizer(com.policourt.api.user.domain.model.User.builder().username(request.getOrganizerUsername()).build())
                .sport(com.policourt.api.sport.domain.model.Sport.builder().slug(request.getSportSlug()).build())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .totalPrice(request.getTotalPrice())
                .build();
    }

    public Class toDomain(BookingClassCreateRequest request) {
        return Class.builder()
                .court(com.policourt.api.court.domain.model.Court.builder().slug(request.getCourtSlug()).build())
                .organizer(com.policourt.api.user.domain.model.User.builder().username(request.getOrganizerUsername()).build())
                .sport(com.policourt.api.sport.domain.model.Sport.builder().slug(request.getSportSlug()).build())
                .title(request.getTitle())
                .description(request.getDescription())
                .totalPrice(request.getTotalPrice())
                .attendeePrice(request.getAttendeePrice())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .build();
    }

    public Class toDomain(BookingClassUpdateRequest request) {
        return Class.builder()
                .court(com.policourt.api.court.domain.model.Court.builder().slug(request.getCourtSlug()).build())
                .organizer(com.policourt.api.user.domain.model.User.builder().username(request.getOrganizerUsername()).build())
                .sport(com.policourt.api.sport.domain.model.Sport.builder().slug(request.getSportSlug()).build())
                .title(request.getTitle())
                .description(request.getDescription())
                .totalPrice(request.getTotalPrice())
                .attendeePrice(request.getAttendeePrice())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .build();
    }

    public Training toDomain(BookingTrainingCreateRequest request) {
        return Training.builder()
                .court(com.policourt.api.court.domain.model.Court.builder().slug(request.getCourtSlug()).build())
                .organizer(com.policourt.api.user.domain.model.User.builder().username(request.getOrganizerUsername()).build())
                .sport(com.policourt.api.sport.domain.model.Sport.builder().slug(request.getSportSlug()).build())
                .club(com.policourt.api.club.domain.model.Club.builder().slug(request.getClubSlug()).build())
                .totalPrice(request.getTotalPrice())
                .attendeePrice(request.getAttendeePrice())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .build();
    }

    public Training toDomain(BookingTrainingUpdateRequest request) {
        return Training.builder()
                .court(com.policourt.api.court.domain.model.Court.builder().slug(request.getCourtSlug()).build())
                .organizer(com.policourt.api.user.domain.model.User.builder().username(request.getOrganizerUsername()).build())
                .sport(com.policourt.api.sport.domain.model.Sport.builder().slug(request.getSportSlug()).build())
                .club(com.policourt.api.club.domain.model.Club.builder().slug(request.getClubSlug()).build())
                .totalPrice(request.getTotalPrice())
                .attendeePrice(request.getAttendeePrice())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .build();
    }

    public BookingResponse toResponse(Booking booking) {
        if (booking == null) {
            return null;
        }

        var court = booking.getCourt() != null ? courtPresentationMapper.toResponse(booking.getCourt()) : null;
        var organizer = booking.getOrganizer() != null ? userPresentationMapper.toResponse(booking.getOrganizer()) : null;
        var sport = booking.getSport() != null ? sportPresentationMapper.toPublicResponse(booking.getSport()) : null;
        var club = (booking instanceof Training training && training.getClub() != null)
                ? clubPresentationMapper.toResponse(training.getClub())
                : null;

        String title = null;
        String description = null;
        var attendeePrice = booking instanceof Class clazz ? clazz.getAttendeePrice() : null;
        if (booking instanceof Class clazz) {
            title = clazz.getTitle();
            description = clazz.getDescription();
        }

        return new BookingResponse(
                booking.getUuid().toString(),
                booking.getType(),
                court,
                organizer,
                sport,
                club,
                title,
                description,
                booking.getTotalPrice(),
                attendeePrice,
                booking.getStartTime(),
                booking.getEndTime(),
                booking.getStatus(),
                booking.getIsActive(),
                booking.getCreatedAt(),
                booking.getUpdatedAt());
    }

    public BookedSlotResponse toBookedSlotResponse(Booking booking) {
        if (booking == null) {
            return null;
        }

        return new BookedSlotResponse(booking.getStartTime(), booking.getEndTime());
    }

    public PaginatedResponse<BookingResponse> toPaginatedResponse(Page<? extends Booking> page) {
        return PaginatedResponse.<BookingResponse>builder()
                .content(page.getContent().stream().map(this::toResponse).toList())
                .page(page.getNumber() + 1)
                .limit(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .first(page.isFirst())
                .last(page.isLast())
                .build();
    }

    public BookingCancellationResponse toCancellationResponse(BookingCancellationResult result) {
        if (result == null) {
            return null;
        }
        return BookingCancellationResponse.builder()
                .booking(toResponse(result.getBooking()))
                .refunded(result.isRefunded())
                .build();
    }
}

