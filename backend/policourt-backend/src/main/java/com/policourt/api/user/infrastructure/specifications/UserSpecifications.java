package com.policourt.api.user.infrastructure.specifications;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import com.policourt.api.shared.enums.GeneralStatus;
import com.policourt.api.user.infrastructure.entity.UserEntity;

import jakarta.persistence.criteria.Predicate;

public class UserSpecifications {

    public static Specification<UserEntity> withFilters(String q, Collection<GeneralStatus> status, Boolean isActive) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(q)) {
                String searchLike = "%" + q.toLowerCase() + "%";
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("username")),
                        searchLike));
            }

            if (status != null && !status.isEmpty()) {
                predicates.add(root.get("status").in(status));
            }

            if (isActive != null) {
                predicates.add(criteriaBuilder.equal(root.get("isActive"), isActive));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
