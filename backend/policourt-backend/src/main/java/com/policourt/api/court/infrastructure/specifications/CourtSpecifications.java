package com.policourt.api.court.infrastructure.specifications;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;

import com.policourt.api.court.domain.enums.CourtSurfaceEnum;
import com.policourt.api.court.infrastructure.entity.CourtEntity;
import com.policourt.api.courtsport.infrastructure.entity.CourtSportEntity;
import com.policourt.api.shared.enums.GeneralStatus;

import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;

public class CourtSpecifications {
    
    public static Specification<CourtEntity> filteredByAtributosEntity(
            String name,
            String locationDetails,
            BigDecimal priceMin,
            BigDecimal priceMax,
            Integer capacityMin,
            Integer capacityMax,
            Boolean isIndoor,
            List<CourtSurfaceEnum> surfaces,
            List<GeneralStatus> statuses,
            Boolean isActive,
            List<String> sportSlugs) {
        return (root, query, cb) -> {
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

            if (capacityMin != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("capacity"), capacityMin));
            }

            if (capacityMax != null) {
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

            if (isActive != null) {
                predicates.add(cb.equal(root.get("isActive"), isActive));
            }

            if (sportSlugs != null && !sportSlugs.isEmpty() && query != null) {
                Subquery<UUID> subquery = query.subquery(UUID.class);
                Root<CourtSportEntity> subroot = subquery.from(CourtSportEntity.class);
                subquery.select(subroot.get("court").get("id"))
                        .where(subroot.get("sport").get("slug").in(sportSlugs));
                
                predicates.add(cb.in(root.get("id")).value(subquery));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
