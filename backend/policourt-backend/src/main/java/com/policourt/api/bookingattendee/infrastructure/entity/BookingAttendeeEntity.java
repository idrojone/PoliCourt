package com.policourt.api.bookingattendee.infrastructure.entity;

import java.time.OffsetDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.policourt.api.booking.infrastructure.entity.BookingEntity;
import com.policourt.api.user.infrastructure.entity.UserEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * CREATE TABLE booking_attendees (
 * id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
 * booking_id BIGINT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
 * user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 * status VARCHAR(50) DEFAULT 'CONFIRMED',
 * joined_at TIMESTAMPTZ DEFAULT NOW(),
 * UNIQUE (booking_id, user_id)
 * );
 */
@Entity
@Table(name = "booking_attendees")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingAttendeeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private BookingEntity booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column(name = "status", length = 50)
    @Builder.Default
    private String status = "CONFIRMED";

    @CreationTimestamp
    @Column(name = "joined_at", nullable = false, updatable = false)
    private OffsetDateTime joinedAt;
}
