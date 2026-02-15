package com.policourt.api.court.infrastructure.entity;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.Set;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.policourt.api.court.domain.enums.CourtSurfaceEnum;
import com.policourt.api.shared.enums.GeneralStatus;

import com.policourt.api.courtsport.infrastructure.entity.CourtSportEntity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "courts")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourtEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "slug", nullable = false, unique = true, length = 100)
    private String slug;

    @Column(name = "name", nullable = false, unique = true, length = 100)
    private String name;

    @Column(name = "location_details", columnDefinition = "TEXT")
    private String locationDetails;

    @Column(name = "img_url", columnDefinition = "TEXT")
    private String imgUrl;

    @Column(name = "price_h", nullable = false, precision = 10, scale = 2)
    private BigDecimal priceH = BigDecimal.ZERO;

    @Column(name = "capacity", nullable = false)
    private Integer capacity = 4;

    @Column(name = "is_indoor", nullable = false)
    private Boolean isIndoor = false;

    @Column(name = "surface", nullable = false)
    @Enumerated(EnumType.STRING)
    private CourtSurfaceEnum surface = CourtSurfaceEnum.HARD;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private GeneralStatus status = GeneralStatus.PUBLISHED;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    @OneToMany(mappedBy = "court", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<CourtSportEntity> courtSports = new HashSet<>();
}