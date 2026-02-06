package com.policourt.springboot.court.infrastructure.specifications;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;

import com.policourt.springboot.court.domain.enums.CourtStatus;
import com.policourt.springboot.court.domain.enums.CourtSurface;
import com.policourt.springboot.court.infrastructure.entity.CourtEntity;

public class CourtSpecifications {

    public static Specification<CourtEntity> searchByQEntity(String q) {
        return (root, cq, cb) -> {
            if (q == null || q.isBlank()) return cb.conjunction();
            String like = "%" + q.toLowerCase() + "%";
            return cb.or(
                cb.like(cb.lower(root.get("name")), like),
                cb.like(cb.lower(root.get("locationDetails")), like)
            );
        };
    }

    public static Specification<CourtEntity> hasSlug(String slug) {
        return (root, query, cb) -> cb.equal(root.get("slug"), slug);
    }

    public static Specification<CourtEntity> filteredByAtributosEntity(String name, String locationDetails, BigDecimal price_h, Integer capacity, Boolean isIndoor, CourtSurface surface, CourtStatus status, Boolean isActive ) {

        return (root, cq, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (name != null && !name.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%"));
            }

            if (locationDetails != null && !locationDetails.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("locationDetails")), "%" + locationDetails.toLowerCase() + "%"));
            }

            if (price_h != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("priceH"), price_h));
            }

            if (capacity != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("capacity"), capacity));
            }

            if (isIndoor != null) {
                predicates.add(cb.equal(root.get("isIndoor"), isIndoor));
            }

            if (surface != null) {
                predicates.add(cb.equal(root.get("surface"), surface));
            }

            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            if (isActive != null) {
                predicates.add(cb.equal(root.get("isActive"), isActive));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    public static Specification<CourtEntity> buildEntity(String q, String name, String locationDetails, BigDecimal price_h, Integer capacity, Boolean isIndoor, CourtSurface surface, CourtStatus status, Boolean isActive) {
        return Specification.where(searchByQEntity(q)).and(filteredByAtributosEntity(name, locationDetails, price_h, capacity, isIndoor, surface, status, isActive));
    }
}