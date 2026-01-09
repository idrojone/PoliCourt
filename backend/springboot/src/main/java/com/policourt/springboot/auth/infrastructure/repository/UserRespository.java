package com.policourt.springboot.auth.infrastructure.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.policourt.springboot.auth.domain.entity.User;

@Repository
public interface UserRespository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);

    Optional<User> findByEmailAndIsActiveTrue(String email);

    boolean existsByEmail(String email);

    boolean existsByEmailAndIdNot(String email, UUID id);
}
