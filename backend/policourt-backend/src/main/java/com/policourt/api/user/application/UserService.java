package com.policourt.api.user.application;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import com.policourt.api.user.domain.model.User;
import com.policourt.api.user.domain.model.UserCriteria;
import com.policourt.api.user.domain.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Busca usuarios en el sistema.
     *
     * @param q        Texto de búsqueda (nombre, apellido, email)
     * @param status   Filtrar por estados
     * @param isActive Filtrar por activo/inactivo
     * @param page     Número de página (1-indexed)
     * @param limit    Cantidad de elementos por página
     * @param sort     Criterio de ordenamiento
     * @return Página de usuarios
     */
    public Page<User> searchUsers(UserCriteria criteria) {

        Sort sortObj = switch (criteria.getSort()) {
            case "name_asc" -> Sort.by("firstName").ascending().and(Sort.by("lastName").ascending());
            case "name_desc" -> Sort.by("firstName").descending().and(Sort.by("lastName").descending());
            case "email_asc" -> Sort.by("email").ascending();
            case "email_desc" -> Sort.by("email").descending();
            case "createdAt_asc" -> Sort.by("createdAt").ascending();
            case "createdAt_desc" -> Sort.by("createdAt").descending();
            default -> Sort.by("firstName").ascending();
        };

        var pageable = PageRequest.of(Math.max(0, criteria.getPage() - 1), criteria.getLimit(), sortObj);
        return userRepository.findByFilters(criteria, pageable);
    }

    /**
     * Actualiza un usuario.
     *
     * @param username    Nombre de usuario
     * @param updatedUser Datos actualizados
     * @param newPassword Nueva contraseña (opcional)
     * @return Usuario actualizado
     */
    @Transactional
    public User updateUser(String username, User updatedUser, String newPassword) {
        User existingUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con username: " + username));

        // Update allowed fields
        if (updatedUser.getFirstName() != null) {
            existingUser.setFirstName(updatedUser.getFirstName());
        }
        if (updatedUser.getLastName() != null) {
            existingUser.setLastName(updatedUser.getLastName());
        }
        if (updatedUser.getPhone() != null) {
            existingUser.setPhone(updatedUser.getPhone());
        }
        if (updatedUser.getDateOfBirth() != null) {
            existingUser.setDateOfBirth(updatedUser.getDateOfBirth());
        }
        if (updatedUser.getGender() != null) {
            existingUser.setGender(updatedUser.getGender());
        }
        if (updatedUser.getAvatarUrl() != null) {
            existingUser.setAvatarUrl(updatedUser.getAvatarUrl());
        }

        // Update password if provided
        if (newPassword != null && !newPassword.isBlank()) {
            existingUser.setPasswordHash(passwordEncoder.encode(newPassword));
        }

        return userRepository.save(existingUser);
    }

    /**
     * Eliminado lógico de un usuario.
     *
     * @param username Nombre de usuario
     */
    @Transactional
    public void deleteUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con username: " + username));
        user.setIsActive(false);
        userRepository.save(user);
    }

    /**
     * Restaurar usuario eliminado.
     *
     * @param username Nombre de usuario
     */
    @Transactional
    public void restoreUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con username: " + username));
        user.setIsActive(true);
        userRepository.save(user);
    }

    /**
     * Actualizar estado de usuario.
     *
     * @param username Nombre de usuario
     * @param status   Nuevo estado
     * @return Usuario actualizado
     */
    @Transactional
    public User updateUserStatus(String username, com.policourt.api.shared.enums.GeneralStatus status) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con username: " + username));
        user.setStatus(status);
        return userRepository.save(user);
    }

    /**
     * Actualizar rol de usuario.
     *
     * @param username Nombre de usuario
     * @param role     Nuevo rol
     * @return Usuario actualizado
     */
    @Transactional
    public User updateUserRole(String username, com.policourt.api.user.domain.enums.UserRole role) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con username: " + username));
        user.setRole(role);
        return userRepository.save(user);
    }
}
