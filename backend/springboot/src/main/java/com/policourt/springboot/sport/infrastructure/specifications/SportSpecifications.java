package com.policourt.springboot.sport.infrastructure.specifications;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import com.policourt.springboot.sport.domain.model.SportStatus;
import com.policourt.springboot.sport.infrastructure.entity.SportEntity;

public class SportSpecifications {

    public static Specification<SportEntity> searchByQEntity(String q) {
        return (root, cq, cb) -> {
            if (q == null || q.isBlank()) return cb.conjunction();
            String like = "%" + q.toLowerCase() + "%";
            return cb.or(
                cb.like(cb.lower(root.get("name")), like)
            );
        };
    }

    public static Specification<SportEntity> filteredByAtributosEntity(String name, SportStatus status, Boolean isActive) {
        return (root, cq, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (name != null && !name.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%"));
            }

            if (status == null || status == SportStatus.PUBLISHED) {
                predicates.add(cb.equal(root.get("status"), SportStatus.PUBLISHED));
            } else {
                // TODO: Solo el admin debería poder ver los borradores, pero por ahora lo dejamos así
                predicates.add(cb.equal(root.get("status"), status));
            }

            if (isActive != null) {
                predicates.add(cb.equal(root.get("isActive"), isActive));
            } else {
                // TODO: Solo el admin debería poder ver los inactivos, pero por ahora lo dejamos así
                predicates.add(cb.equal(root.get("isActive"), true));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    public static Specification<SportEntity> buildEntity(String q, SportStatus status, Boolean isActive) {
        return Specification.where(searchByQEntity(q)).and(filteredByAtributosEntity(null, status, isActive));
    }
}                                                                                                 