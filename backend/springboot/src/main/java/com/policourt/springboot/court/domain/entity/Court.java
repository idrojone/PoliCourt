package com.policourt.springboot.court.domain.entity;

import java.util.UUID;

import org.apache.commons.lang3.builder.EqualsExclude;
import org.hibernate.annotations.UuidGenerator;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.EqualsAndHashCode;

public class Court {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @UuidGenerator(style = UuidGenerator.Style.TIME)
    @Column(name = "slug", updatable = false, nullable = false, unique = true)
    @EqualsAndHashCode.Include
    private UUID slug;

    @Column(name = "name", nullable = false, length = 255)
    @EqualsExclude
    private String name;

    @Column(name = "sport", nullable = false, length = 100)
    @EqualsExclude
    private String sport;

    @Column(name = "surface", nullable = false, length = 100)
    @EqualsExclude
    private String surface;

    @Column(name = "indoor", nullable = false)
    @EqualsExclude
    private boolean indoor;

    @Column(name = "location", nullable = false, length = 500)
    @EqualsExclude
    private String location;

    @Column(name = "description", length = 1000)
    @EqualsExclude
    private String description;

    @Column(name = "price_per_hour", nullable = false)
    @EqualsExclude
    private double price_per_hour;
}

