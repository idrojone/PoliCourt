package com.policourt.api.sport.infrastructure.specifications;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.policourt.api.shared.enums.GeneralStatus;
import com.policourt.api.sport.infrastructure.entity.SportEntity;

import jakarta.persistence.criteria.Predicate;

public class SportSpecifications {
    public static Specification<SportEntity> searchByQEntity(String q) {
        return (root, cq, cb) -> {
            if (q == null || q.isBlank())
                return cb.conjunction();
            String like = "%" + q.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("name")), like));
        };
    }

    public static Specification<SportEntity> filteredByAtributosEntity(String name, Collection<GeneralStatus> statuses,
            Boolean isActive) {
        return (root, cq, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (name != null && !name.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%"));
            }

            // Filtrado por múltiples estados (checkboxes)
            if (statuses != null && !statuses.isEmpty()) {
                predicates.add(root.get("status").in(statuses));
            }

            if (isActive != null) {
                predicates.add(cb.equal(root.get("isActive"), isActive));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    public static Specification<SportEntity> buildEntity(String q, Collection<GeneralStatus> statuses,
            Boolean isActive) {
        return searchByQEntity(q).and(filteredByAtributosEntity(null, statuses, isActive));
    }
}
