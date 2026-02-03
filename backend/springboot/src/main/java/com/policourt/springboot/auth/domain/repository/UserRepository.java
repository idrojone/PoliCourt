package com.policourt.springboot.auth.domain.repository;

import com.policourt.springboot.auth.domain.enums.UserRole;
import com.policourt.springboot.auth.domain.model.User;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Interfaz del repositorio para la gestión de usuarios en la capa de dominio.
 */
public interface UserRepository {
    /**
     * Guarda un usuario en el repositorio.
     *
     * @param user El usuario a guardar.
     * @return El usuario guardado.
     */
    User save(User user);

    /**
     * Busca un usuario por su dirección de correo electrónico.
     *
     * @param email El correo electrónico del usuario.
     * @return Un Optional que contiene el usuario si se encuentra, o vacío si no.
     */
    Optional<User> findByEmail(String email);

    /**
     * Busca un usuario por su nombre de usuario.
     *
     * @param username El nombre de usuario.
     * @return Un Optional que contiene el usuario si se encuentra, o vacío si no.
     */
    Optional<User> findByUsername(String username);

    /**
     * Elimina un usuario por su identificador único.
     *
     * @param id El UUID del usuario a eliminar.
     */
    void deleteById(UUID id);

    /**
     * Recupera todos los usuarios del repositorio.
     *
     * @return Una lista con todos los usuarios.
     */
    List<User> findAll();

    /**
     * Busca usuarios cuyo nombre de usuario contenga el término proporcionado.
     *
     * @param username El término de búsqueda.
     * @return Una lista de usuarios que coinciden con el criterio.
     */
    List<User> searchByUsername(String username);

    /**
     * Busca todos los usuarios con un rol específico.
     *
     * @param role El rol por el cual filtrar.
     * @return Una lista de usuarios con dicho rol.
     */
    List<User> findByRole(UserRole role);

    /**
     * Busca usuarios por rol y username (búsqueda parcial).
     *
     * @param role     El rol por el cual filtrar.
     * @param username El término de búsqueda para el nombre de usuario.
     * @return Una lista de usuarios que cumplen ambos criterios.
     */
    List<User> searchByRoleAndUsername(UserRole role, String username);
}
