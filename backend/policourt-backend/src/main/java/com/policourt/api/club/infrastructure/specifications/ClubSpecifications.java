package com.policourt.api.club.infrastructure.specifications;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.policourt.api.club.infrastructure.entity.ClubEntity;
import com.policourt.api.shared.enums.GeneralStatus;

import jakarta.persistence.criteria.Predicate;

public class ClubSpecifications {

    public static Specification<ClubEntity> filteredByAttributes(
            String name,
            GeneralStatus status,
            Boolean isActive,
            List<String> sportSlugs) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (name != null && !name.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%"));
            }

            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            if (isActive != null) {
                predicates.add(cb.equal(root.get("isActive"), isActive));
            }

            if (sportSlugs != null && !sportSlugs.isEmpty()) {
                predicates.add(root.get("sport").get("slug").in(sportSlugs));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
