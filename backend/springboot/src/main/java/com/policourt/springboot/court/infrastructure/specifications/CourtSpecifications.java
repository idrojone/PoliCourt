package com.policourt.springboot.court.infrastructure.specifications;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Collection;

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

    public static Specification<CourtEntity> filteredByAtributosEntity(String name, String locationDetails, BigDecimal priceMin, BigDecimal priceMax, Integer capacityMin, Integer capacityMax, Boolean isIndoor, Collection<CourtSurface> surfaces, Collection<CourtStatus> statuses, java.util.Collection<String> sportSlugs, Boolean isActive ) {

        return (root, cq, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (name != null && !name.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%"));
            }

            if (locationDetails != null && !locationDetails.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("locationDetails")), "%" + locationDetails.toLowerCase() + "%"));
            }

            if (priceMin != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("priceH"), priceMin));
            }

            if (priceMax != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("priceH"), priceMax));
            }

            if (capacityMin != null && capacityMax != null && capacityMin > capacityMax) {
                return cb.disjunction();
            }

            if (capacityMin != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("capacity"), capacityMin));
            } else if (capacityMax != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("capacity"), capacityMax));
            }

            if (isIndoor != null) {
                predicates.add(cb.equal(root.get("isIndoor"), isIndoor));
            }

            if (surfaces != null && !surfaces.isEmpty()) {
                predicates.add(root.get("surface").in(surfaces));
            }

            if (statuses != null && !statuses.isEmpty()) {
                predicates.add(root.get("status").in(statuses));
            }
            
            if (sportSlugs != null && !sportSlugs.isEmpty()) {
                cq.distinct(true);
                predicates.add(root.join("sportAssignments").get("sport").get("slug").in(sportSlugs));
            }

            if (isActive != null) {
                predicates.add(cb.equal(root.get("isActive"), isActive));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    public static Specification<CourtEntity> buildEntity(String q, String name, String locationDetails, BigDecimal priceMin, BigDecimal priceMax, Integer capacityMin, Integer capacityMax, Boolean isIndoor, Collection<CourtSurface> surfaces, Collection<CourtStatus> statuses, java.util.Collection<String> sportSlugs, Boolean isActive) {
        return Specification.where(searchByQEntity(q)).and(filteredByAtributosEntity(name, locationDetails, priceMin, priceMax, capacityMin, capacityMax, isIndoor, surfaces, statuses, sportSlugs, isActive));
    }
}