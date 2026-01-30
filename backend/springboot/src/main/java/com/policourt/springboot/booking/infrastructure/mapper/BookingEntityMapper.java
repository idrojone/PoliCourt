package com.policourt.springboot.booking.infrastructure.mapper;

import com.policourt.springboot.auth.infrastructure.mapper.UserMapper;
import com.policourt.springboot.booking.domain.model.Booking;
import com.policourt.springboot.booking.domain.model.BookingAttendee;
import com.policourt.springboot.booking.infrastructure.entity.BookingAttendeeEntity;
import com.policourt.springboot.booking.infrastructure.entity.BookingEntity;
import com.policourt.springboot.court.infrastructure.mapper.CourtMapper;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class BookingEntityMapper {

    private final CourtMapper courtMapper;
    private final UserMapper userMapper;

    public BookingEntity toEntity(Booking domain) {
        if (domain == null) {
            return null;
        }

        BookingEntity entity = BookingEntity.builder()
            .id(domain.getId())
            .slug(domain.getSlug())
            .court(courtMapper.toEntity(domain.getCourt()))
            .organizer(userMapper.toEntity(domain.getOrganizer()))
            .type(domain.getType())
            .title(domain.getTitle())
            .description(domain.getDescription())
            .startTime(domain.getStartTime())
            .endTime(domain.getEndTime())
            .totalPrice(domain.getTotalPrice())
            .attendeePrice(domain.getAttendeePrice())
            .status(domain.getStatus())
            .isActive(domain.isActive())
            .build();

        if (domain.getAttendees() != null) {
            entity.setAttendees(
                domain
                    .getAttendees()
                    .stream()
                    .map(this::toAttendeeEntity)
                    .peek(attendeeEntity -> attendeeEntity.setBooking(entity))
                    .collect(Collectors.toList())
            );
        }

        return entity;
    }

    public Booking toDomain(BookingEntity entity) {
        if (entity == null) {
            return null;
        }

        return Booking.builder()
            .id(entity.getId())
            .slug(entity.getSlug())
            .court(courtMapper.toDomain(entity.getCourt()))
            .organizer(userMapper.toDomain(entity.getOrganizer()))
            .type(entity.getType())
            .title(entity.getTitle())
            .description(entity.getDescription())
            .startTime(entity.getStartTime())
            .endTime(entity.getEndTime())
            .totalPrice(entity.getTotalPrice())
            .attendeePrice(entity.getAttendeePrice())
            .status(entity.getStatus())
            .isActive(
                entity.getIsActive() != null ? entity.getIsActive() : true
            )
            .createdAt(entity.getCreatedAt())
            .updatedAt(entity.getUpdatedAt())
            .attendees(
                entity
                    .getAttendees()
                    .stream()
                    .map(this::toAttendeeDomain)
                    .collect(Collectors.toList())
            )
            .build();
    }

    private BookingAttendeeEntity toAttendeeEntity(
        BookingAttendee attendeeDomain
    ) {
        if (attendeeDomain == null) {
            return null;
        }
        return BookingAttendeeEntity.builder()
            .id(attendeeDomain.getId())
            .user(userMapper.toEntity(attendeeDomain.getUser()))
            .status(attendeeDomain.getStatus())
            .build();
    }

    private BookingAttendee toAttendeeDomain(
        BookingAttendeeEntity attendeeEntity
    ) {
        if (attendeeEntity == null) {
            return null;
        }
        return BookingAttendee.builder()
            .id(attendeeEntity.getId())
            .user(userMapper.toDomain(attendeeEntity.getUser()))
            .status(attendeeEntity.getStatus())
            .joinedAt(attendeeEntity.getJoinedAt())
            .build();
    }
}
