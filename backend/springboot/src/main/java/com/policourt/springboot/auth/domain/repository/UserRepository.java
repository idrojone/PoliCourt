package com.policourt.springboot.auth.domain.repository;

import com.policourt.springboot.auth.domain.enums.UserRole;
import com.policourt.springboot.auth.domain.model.User;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository {
    User save(User user);
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    void deleteById(UUID id);
    List<User> findAll();
    List<User> searchByUsername(String username);

    /**
     * Busca todos los usuarios con un rol específico.
     */
    List<User> findByRole(UserRole role);

    /**
     * Busca usuarios por rol y username (búsqueda parcial).
     */
    List<User> searchByRoleAndUsername(UserRole role, String username);
}
