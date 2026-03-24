package com.policourt.api.user.infrastructure.adapter;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import com.policourt.api.user.domain.model.User;
import com.policourt.api.user.domain.model.UserCriteria;
import com.policourt.api.user.domain.repository.UserRepository;
import com.policourt.api.user.infrastructure.entity.UserEntity;
import com.policourt.api.user.infrastructure.mapper.UserMapper;
import com.policourt.api.user.infrastructure.repository.UserJpaRepository;
import com.policourt.api.user.infrastructure.specifications.UserSpecifications;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
@SuppressWarnings("null")
public class UserRepositoryAdapter implements UserRepository {

    private final UserJpaRepository userJpaRepository;
    private final UserMapper userMapper;

    @Override
    public User save(User user) {
        if (user.getId() != null) {
            return userJpaRepository.findById(user.getId())
                    .map(existing -> {
                        existing.setUsername(user.getUsername());
                        existing.setEmail(user.getEmail());
                        existing.setPasswordHash(user.getPasswordHash());
                        existing.setFirstName(user.getFirstName());
                        existing.setLastName(user.getLastName());
                        existing.setPhone(user.getPhone());
                        existing.setDateOfBirth(user.getDateOfBirth());
                        existing.setGender(user.getGender());
                        existing.setAvatarUrl(user.getAvatarUrl());
                        existing.setRole(user.getRole());
                        existing.setStatus(user.getStatus());
                        existing.setIsActive(user.getIsActive());
                        existing.setIsEmailVerified(user.getIsEmailVerified());
                        existing.setLastLoginAt(user.getLastLoginAt());
                        existing.setSessionVersion(user.getSessionVersion());
                        UserEntity saved = userJpaRepository.save(existing);
                        return userMapper.toDomain(saved);
                    })
                    .orElseGet(() -> {
                        UserEntity entity = userMapper.toEntity(user);
                        UserEntity savedEntity = userJpaRepository.save(entity);
                        return userMapper.toDomain(savedEntity);
                    });
        }

        UserEntity entity = userMapper.toEntity(user);
        UserEntity savedEntity = userJpaRepository.save(entity);
        return userMapper.toDomain(savedEntity);
    }

    @Override
    public Optional<User> findById(Long id) {
        return userJpaRepository.findById(id).map(userMapper::toDomain);
    }

    @Override
    public Page<User> findByFilters(UserCriteria criteria, Pageable pageable) {
        Specification<UserEntity> spec = UserSpecifications.withFilters(criteria.getQ(), criteria.getStatus(),
                criteria.getIsActive());
        Page<UserEntity> entityPage = userJpaRepository.findAll(spec, pageable);
        return entityPage.map(userMapper::toDomain);
    }

    @Override
    public Optional<User> findByUsername(String username) {
        return Optional.ofNullable(userJpaRepository.findByUsername(username))
                .map(userMapper::toDomain);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return Optional.ofNullable(userJpaRepository.findByEmail(email))
                .map(userMapper::toDomain);
    }
}
