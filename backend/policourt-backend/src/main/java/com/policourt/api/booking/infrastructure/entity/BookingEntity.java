package com.policourt.api.booking.infrastructure.entity;

import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.Set;
import java.math.BigDecimal;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.policourt.api.booking.domain.enums.BookingStatusEnum;
import com.policourt.api.booking.domain.enums.BookingTypeEnum;
import com.policourt.api.bookingattendee.infrastructure.entity.BookingAttendeeEntity;
import com.policourt.api.club.infrastructure.entity.ClubEntity;
import com.policourt.api.court.infrastructure.entity.CourtEntity;
import com.policourt.api.sport.infrastructure.entity.SportEntity;
import com.policourt.api.user.infrastructure.entity.UserEntity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * CREATE TABLE bookings (
 * id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
 * slug VARCHAR(255) UNIQUE NOT NULL,
 * court_id BIGINT NOT NULL REFERENCES courts(id) ON DELETE CASCADE,
 * organizer_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 * sport_id BIGINT REFERENCES sports(id) ON DELETE RESTRICT,
 * type booking_type_enum NOT NULL DEFAULT 'RENTAL',
 * title VARCHAR(150),
 * description TEXT,
 * start_time TIMESTAMPTZ NOT NULL,
 * end_time TIMESTAMPTZ NOT NULL,
 * total_price DECIMAL(10, 2) DEFAULT 0,
 * attendee_price DECIMAL(10, 2) DEFAULT 0,
 * status booking_status_enum DEFAULT 'CONFIRMED' NOT NULL,
 * is_active BOOLEAN DEFAULT TRUE NOT NULL,
 * created_at TIMESTAMPTZ DEFAULT NOW(),
 * updated_at TIMESTAMPTZ DEFAULT NOW(),
 * club_id BIGINT REFERENCES clubs(id) ON DELETE CASCADE -- From V2
 * );
 */
@Entity
@Table(name = "bookings")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "slug", nullable = false, unique = true, length = 255)
    private String slug;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "court_id", nullable = false)
    private CourtEntity court;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizer_id", nullable = false)
    private UserEntity organizer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sport_id")
    private SportEntity sport;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "club_id")
    private ClubEntity club;

    @Column(name = "type", nullable = false)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private BookingTypeEnum type = BookingTypeEnum.RENTAL;

    @Column(name = "title", length = 150)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "start_time", nullable = false)
    private OffsetDateTime startTime;

    @Column(name = "end_time", nullable = false)
    private OffsetDateTime endTime;

    @Column(name = "total_price", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal totalPrice = BigDecimal.ZERO;

    @Column(name = "attendee_price", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal attendeePrice = BigDecimal.ZERO;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private BookingStatusEnum status = BookingStatusEnum.CONFIRMED;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    @OneToMany(mappedBy = "booking", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<BookingAttendeeEntity> attendees = new HashSet<>();
}
