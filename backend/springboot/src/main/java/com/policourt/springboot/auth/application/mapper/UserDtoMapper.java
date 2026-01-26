package com.policourt.springboot.auth.application.mapper;

import com.policourt.springboot.auth.domain.model.User;
import com.policourt.springboot.auth.presentation.request.UserRequest;
import com.policourt.springboot.auth.presentation.response.UserResponse;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

@Component
public class UserDtoMapper {

    public User toDomain(UserRequest request) {
        if (request == null) {
            return null;
        }

        return User.builder()
            .username(request.username())
            .email(request.email())
            .firstName(request.firstName())
            .lastName(request.lastName())
            .phone(request.phone())
            .build();
    }

    public UserResponse toResponse(User user) {
        if (user == null) {
            return null;
        }

        return new UserResponse(
            user.getUsername(),
            user.getEmail(),
            user.getFirstName(),
            user.getLastName(),
            user.getPhone(),
            user.getImgUrl(),
            user.getRole(),
            user.getStatus(),
            user.isActive()
        );
    }

    public List<UserResponse> toResponseList(List<User> users) {
        return users
            .stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }
}
