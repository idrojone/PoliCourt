package com.policourt.api.user.domain.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.policourt.api.user.domain.model.User;
import com.policourt.api.user.domain.model.UserCriteria;

public interface UserRepository {
    User save(User user);

    Optional<User> findById(Long id);

    Page<User> findByFilters(UserCriteria criteria, Pageable pageable);

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);
}