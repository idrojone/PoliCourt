package com.policourt.springboot.auth.infrastructure.repository;

import com.policourt.springboot.auth.domain.enums.UserRole;
import com.policourt.springboot.auth.infrastructure.entity.UserEntity;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repositorio JPA para la entidad {@link UserEntity}.
 * Extiende de {@link JpaRepository} para proporcionar operaciones CRUD estándar y consultas derivadas
 * contra la base de datos PostgreSQL.
 */
@Repository
public interface UserJpaRepository extends JpaRepository<UserEntity, UUID> {

    /**
     * Busca una entidad de usuario por su correo electrónico exacto.
     *
     * @param email El correo electrónico a buscar.
     * @return Un {@link Optional} que contiene la entidad si existe, o vacío si no.
     */
    Optional<UserEntity> findByEmail(String email);

    /**
     * Busca una entidad de usuario por su nombre de usuario exacto.
     *
     * @param username El nombre de usuario a buscar.
     * @return Un {@link Optional} que contiene la entidad si existe, o vacío si no.
     */
    Optional<UserEntity> findByUsername(String username);

    /**
     * Busca entidades de usuario cuyo nombre de usuario contenga la cadena proporcionada,
     * ignorando mayúsculas y minúsculas.
     *
     * @param username La subcadena a buscar en el nombre de usuario.
     * @return Una lista de entidades que coinciden con el criterio.
     */
    List<UserEntity> findByUsernameContainingIgnoreCase(String username);

    /**
     * Busca todas las entidades de usuario que tienen un rol específico asignado.
     *
     * @param role El rol por el cual filtrar (ej. ADMIN, PLAYER).
     * @return Una lista de entidades con dicho rol.
     */
    List<UserEntity> findByRole(UserRole role);

    /**
     * Busca entidades de usuario filtrando por rol y por coincidencia parcial en el nombre de usuario,
     * ignorando mayúsculas y minúsculas.
     *
     * @param role     El rol por el cual filtrar.
     * @param username La subcadena a buscar en el nombre de usuario.
     * @return Una lista de entidades que cumplen ambos criterios.
     */
    List<UserEntity> findByRoleAndUsernameContainingIgnoreCase(UserRole role, String username);
}
