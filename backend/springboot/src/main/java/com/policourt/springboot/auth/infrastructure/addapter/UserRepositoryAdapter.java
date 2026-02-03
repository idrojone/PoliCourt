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

/**
 * Adaptador de infraestructura para la persistencia de usuarios.
 * Implementa el puerto {@link UserRepository} utilizando Spring Data JPA.
 */
@Repository
@RequiredArgsConstructor
public class UserRepositoryAdapter implements UserRepository {

    private final UserJpaRepository userJpaRepository;
    private final UserMapper userMapper;

    /**
     * Guarda un usuario en la base de datos.
     * @param user El modelo de dominio del usuario a guardar.
     * @return El usuario guardado convertido a modelo de dominio.
     */
    @Override
    public User save(User user) {
        var userEntity = userMapper.toEntity(user);
        var savedEntity = userJpaRepository.save(userEntity);
        return userMapper.toDomain(savedEntity);
    }

    /**
     * Busca un usuario por su correo electrónico.
     * @param email El correo electrónico del usuario.
     * @return Un Optional con el usuario si se encuentra, o vacío si no.
     */
    @Override
    public Optional<User> findByEmail(String email) {
        return userJpaRepository.findByEmail(email).map(userMapper::toDomain);
    }

    /**
     * Busca un usuario por su nombre de usuario exacto.
     * @param username El nombre de usuario.
     * @return Un Optional con el usuario si se encuentra.
     */
    @Override
    public Optional<User> findByUsername(String username) {
        return userJpaRepository
            .findByUsername(username)
            .map(userMapper::toDomain);
    }

    /**
     * Elimina un usuario por su identificador único.
     * @param id El UUID del usuario.
     */
    @Override
    public void deleteById(UUID id) {
        userJpaRepository.deleteById(id);
    }

    /**
     * Obtiene todos los usuarios registrados.
     * @return Una lista de todos los usuarios en el dominio.
     */
    @Override
    public List<User> findAll() {
        return userJpaRepository
            .findAll()
            .stream()
            .map(userMapper::toDomain)
            .collect(Collectors.toList());
    }

    /**
     * Busca usuarios cuyo nombre de usuario contenga la cadena proporcionada (ignora mayúsculas).
     * @param username Cadena de búsqueda.
     * @return Lista de usuarios que coinciden con el criterio.
     */
    @Override
    public List<User> searchByUsername(String username) {
        return userJpaRepository
            .findByUsernameContainingIgnoreCase(username)
            .stream()
            .map(userMapper::toDomain)
            .collect(Collectors.toList());
    }

    /**
     * Filtra usuarios por su rol en el sistema.
     * @param role El rol a filtrar.
     * @return Lista de usuarios con dicho rol.
     */
    @Override
    public List<User> findByRole(UserRole role) {
        return userJpaRepository
            .findByRole(role)
            .stream()
            .map(userMapper::toDomain)
            .collect(Collectors.toList());
    }

    /**
     * Realiza una búsqueda combinada por rol y coincidencia parcial de nombre de usuario.
     * @param role El rol del usuario.
     * @param username Cadena de búsqueda para el nombre de usuario.
     * @return Lista de usuarios que cumplen ambos criterios.
     */
    @Override
    public List<User> searchByRoleAndUsername(UserRole role, String username) {
        return userJpaRepository
            .findByRoleAndUsernameContainingIgnoreCase(role, username)
            .stream()
            .map(userMapper::toDomain)
            .collect(Collectors.toList());
    }
}
