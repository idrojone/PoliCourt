package com.policourt.springboot.auth.infrastructure.addapter;

import com.policourt.springboot.auth.domain.enums.UserRole;
import com.policourt.springboot.auth.domain.model.User;
import com.policourt.springboot.auth.domain.repository.UserRepository;
import com.policourt.springboot.auth.infrastructure.mapper.UserMapper;
import com.policourt.springboot.auth.infrastructure.repository.UserJpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class UserRepositoryAdapter implements UserRepository {

    private final UserJpaRepository userJpaRepository;
    private final UserMapper userMapper;

    @Override
    public User save(User user) {
        var userEntity = userMapper.toEntity(user);
        var savedEntity = userJpaRepository.save(userEntity);
        return userMapper.toDomain(savedEntity);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return userJpaRepository.findByEmail(email).map(userMapper::toDomain);
    }

    @Override
    public Optional<User> findByUsername(String username) {
        return userJpaRepository
            .findByUsername(username)
            .map(userMapper::toDomain);
    }

    @Override
    public void deleteById(UUID id) {
        userJpaRepository.deleteById(id);
    }

    @Override
    public List<User> findAll() {
        return userJpaRepository
            .findAll()
            .stream()
            .map(userMapper::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    public List<User> searchByUsername(String username) {
        return userJpaRepository
            .findByUsernameContainingIgnoreCase(username)
            .stream()
            .map(userMapper::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    public List<User> findByRole(UserRole role) {
        return userJpaRepository
            .findByRole(role)
            .stream()
            .map(userMapper::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    public List<User> searchByRoleAndUsername(UserRole role, String username) {
        return userJpaRepository
            .findByRoleAndUsernameContainingIgnoreCase(role, username)
            .stream()
            .map(userMapper::toDomain)
            .collect(Collectors.toList());
    }
}
