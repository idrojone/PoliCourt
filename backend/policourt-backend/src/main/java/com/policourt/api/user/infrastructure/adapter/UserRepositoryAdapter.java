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
