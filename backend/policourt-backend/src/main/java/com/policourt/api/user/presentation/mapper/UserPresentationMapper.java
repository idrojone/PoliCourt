package com.policourt.api.user.presentation.mapper;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.Collection;

import com.policourt.api.shared.enums.GeneralStatus;
import com.policourt.api.shared.response.PaginatedResponse;
import com.policourt.api.user.domain.model.User;
import com.policourt.api.user.domain.model.UserCriteria;
import com.policourt.api.user.presentation.request.UserUpdateRequest;
import com.policourt.api.user.presentation.response.UserResponse;

@Component
public class UserPresentationMapper {

    public UserResponse toResponse(User user) {
        if (user == null) {
            return null;
        }
        return new UserResponse(
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getPhone(),
                user.getDateOfBirth(),
                user.getGender(),
                user.getAvatarUrl(),
                user.getRole(),
                user.getStatus(),
                user.getIsActive(),
                user.getIsEmailVerified(),
                user.getLastLoginAt(),
                user.getCreatedAt());
    }

    public PaginatedResponse<UserResponse> toPaginatedResponse(Page<User> page) {
        return PaginatedResponse.<UserResponse>builder()
                .content(page.getContent().stream().map(this::toResponse).toList())
                .page(page.getNumber() + 1)
                .limit(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .first(page.isFirst())
                .last(page.isLast())
                .build();
    }

    public UserCriteria toCriteria(String q, Collection<GeneralStatus> status, Boolean isActive, int page, int limit,
            String sort) {
        return UserCriteria.builder()
                .q(q)
                .status(status)
                .isActive(isActive)
                .limit(limit)
                .sort(sort)
                .build();
    }

    public User toDomain(UserUpdateRequest request) {
        if (request == null) {
            return null;
        }
        return User.builder()
                .firstName(request.firstName())
                .lastName(request.lastName())
                .phone(request.phone())
                .dateOfBirth(request.dateOfBirth())
                .gender(request.gender())
                .avatarUrl(request.avatarUrl())
                // Password handled separately
                .build();
    }
}
