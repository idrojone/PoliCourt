package com.policourt.api.booking.infrastructure.specifications;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import com.policourt.api.booking.domain.enums.BookingStatusEnum;
import com.policourt.api.booking.domain.enums.BookingTypeEnum;
import com.policourt.api.booking.infrastructure.entity.BookingEntity;

import jakarta.persistence.criteria.Predicate;

public class BookingSpecifications {

    public static Specification<BookingEntity> filteredByFilters(
            String q,
            String sportSlug,
            String courtSlug,
            String organizerUsername,
            BookingTypeEnum type,
            BookingStatusEnum status,
            Boolean isActive,
            Long clubId) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(q)) {
                String like = "%" + q.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("title")), like),
                        cb.like(cb.lower(root.get("description")), like)));
            }

            if (sportSlug != null && !sportSlug.isBlank()) {
                predicates.add(cb.equal(root.get("sport").get("slug"), sportSlug));
            }

            if (courtSlug != null && !courtSlug.isBlank()) {
                predicates.add(cb.equal(root.get("court").get("slug"), courtSlug));
            }

            if (organizerUsername != null && !organizerUsername.isBlank()) {
                predicates.add(cb.equal(root.get("organizer").get("username"), organizerUsername));
            }

            if (type != null) {
                predicates.add(cb.equal(root.get("type"), type));
            }

            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            if (isActive != null) {
                predicates.add(cb.equal(root.get("isActive"), isActive));
            }

            if (clubId != null) {
                predicates.add(cb.equal(root.get("club").get("id"), clubId));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
