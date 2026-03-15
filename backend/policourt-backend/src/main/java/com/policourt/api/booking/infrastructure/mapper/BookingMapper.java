package com.policourt.api.booking.infrastructure.mapper;

import org.springframework.stereotype.Component;

import com.policourt.api.booking.domain.enums.BookingTypeEnum;
import com.policourt.api.booking.domain.model.Booking;
import com.policourt.api.booking.domain.model.Class;
import com.policourt.api.booking.domain.model.Training;
import com.policourt.api.booking.infrastructure.entity.BookingEntity;
import com.policourt.api.club.infrastructure.mapper.ClubMapper;
import com.policourt.api.court.infrastructure.mapper.CourtMapper;
import com.policourt.api.sport.infrastructure.mapper.SportMapper;
import com.policourt.api.user.infrastructure.mapper.UserMapper;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class BookingMapper {

    private final CourtMapper courtMapper;
    private final UserMapper userMapper;
    private final SportMapper sportMapper;
    private final ClubMapper clubMapper;

    public Booking toDomain(BookingEntity entity) {
        if (entity == null) {
            return null;
        }

        BookingTypeEnum type = entity.getType();

        if (type == BookingTypeEnum.CLASS) {
            return Class.builder()
                    .id(entity.getId())
                    .uuid(entity.getUuid())
                    .court(courtMapper.toDomain(entity.getCourt()))
                    .organizer(userMapper.toDomain(entity.getOrganizer()))
                    .sport(entity.getSport() != null ? sportMapper.toDomain(entity.getSport()) : null)
                    .type(entity.getType())
                    .startTime(entity.getStartTime())
                    .endTime(entity.getEndTime())
                    .totalPrice(entity.getTotalPrice())
                    .status(entity.getStatus())
                    .isActive(entity.getIsActive())
                    .createdAt(entity.getCreatedAt())
                    .updatedAt(entity.getUpdatedAt())
                    .title(entity.getTitle())
                    .description(entity.getDescription())
                    .attendeePrice(entity.getAttendeePrice())
                    .build();
        }

        if (type == BookingTypeEnum.TRAINING) {
            return Training.builder()
                    .id(entity.getId())
                    .uuid(entity.getUuid())
                    .court(courtMapper.toDomain(entity.getCourt()))
                    .organizer(userMapper.toDomain(entity.getOrganizer()))
                    .sport(entity.getSport() != null ? sportMapper.toDomain(entity.getSport()) : null)
                    .type(entity.getType())
                    .startTime(entity.getStartTime())
                    .endTime(entity.getEndTime())
                    .totalPrice(entity.getTotalPrice())
                    .status(entity.getStatus())
                    .isActive(entity.getIsActive())
                    .createdAt(entity.getCreatedAt())
                    .updatedAt(entity.getUpdatedAt())
                    .club(clubMapper.toDomain(entity.getClub()))
                    .attendeePrice(entity.getAttendeePrice())
                    .build();
        }

        return Booking.builder()
                .id(entity.getId())
                .uuid(entity.getUuid())
                .court(courtMapper.toDomain(entity.getCourt()))
                .organizer(userMapper.toDomain(entity.getOrganizer()))
                .sport(entity.getSport() != null ? sportMapper.toDomain(entity.getSport()) : null)
                .type(entity.getType())
                .startTime(entity.getStartTime())
                .endTime(entity.getEndTime())
                .totalPrice(entity.getTotalPrice())
                .status(entity.getStatus())
                .isActive(entity.getIsActive())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public BookingEntity toEntity(Booking booking) {
        if (booking == null) {
            return null;
        }

        BookingEntity entity = BookingEntity.builder()
                .id(booking.getId())
                .uuid(booking.getUuid())
                .type(booking.getType())
                .startTime(booking.getStartTime())
                .endTime(booking.getEndTime())
                .totalPrice(booking.getTotalPrice())
                .status(booking.getStatus())
                .isActive(booking.getIsActive())
                .build();

        if (booking instanceof Class clazz) {
            entity.setTitle(clazz.getTitle());
            entity.setDescription(clazz.getDescription());
            entity.setAttendeePrice(clazz.getAttendeePrice());
        }

        if (booking instanceof Training training) {
            entity.setClub(clubMapper.toEntity(training.getClub()));
            entity.setAttendeePrice(training.getAttendeePrice());
        }

        return entity;
    }

    public void updateEntity(BookingEntity entity, Booking booking) {
        entity.setUuid(booking.getUuid());
        entity.setType(booking.getType());
        entity.setStartTime(booking.getStartTime());
        entity.setEndTime(booking.getEndTime());
        entity.setTotalPrice(booking.getTotalPrice());
        entity.setStatus(booking.getStatus());
        entity.setIsActive(booking.getIsActive());

        if (booking instanceof Class clazz) {
            entity.setTitle(clazz.getTitle());
            entity.setDescription(clazz.getDescription());
            entity.setAttendeePrice(clazz.getAttendeePrice());
        } else {
            entity.setTitle(null);
            entity.setDescription(null);
            entity.setAttendeePrice(null);
        }

        if (booking instanceof Training training) {
            entity.setClub(clubMapper.toEntity(training.getClub()));
            entity.setAttendeePrice(training.getAttendeePrice());
        } else {
            // Only clear club when not a training
            entity.setClub(null);
        }
    }
}
