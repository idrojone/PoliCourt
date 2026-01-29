package com.policourt.springboot.auth.infrastructure.repository;

import com.policourt.springboot.auth.domain.enums.UserRole;
import com.policourt.springboot.auth.infrastructure.entity.UserEntity;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserJpaRepository extends JpaRepository<UserEntity, UUID> {
    Optional<UserEntity> findByEmail(String email);

    Optional<UserEntity> findByUsername(String username);

    List<UserEntity> findByUsernameContainingIgnoreCase(String username);

    /**
     * Busca usuarios por rol.
     */
    List<UserEntity> findByRole(UserRole role);

    /**
     * Busca usuarios por rol y username (búsqueda parcial, case-insensitive).
     */
    List<UserEntity> findByRoleAndUsernameContainingIgnoreCase(UserRole role, String username);
}
