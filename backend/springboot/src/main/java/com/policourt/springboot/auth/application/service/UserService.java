package com.policourt.springboot.auth.application.service;

import com.policourt.springboot.auth.application.mapper.UserDtoMapper;
import com.policourt.springboot.auth.domain.enums.UserRole;
import com.policourt.springboot.auth.domain.enums.UserStatus;
import com.policourt.springboot.auth.domain.model.User;
import com.policourt.springboot.auth.domain.repository.UserRepository;
import com.policourt.springboot.auth.presentation.request.UserRequest;
import com.policourt.springboot.auth.presentation.response.UserResponse;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.Locale;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Servicio encargado de la lógica de negocio relacionada con la gestión de usuarios.
 */
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserDtoMapper userDtoMapper;
    private final PasswordEncoder passwordEncoder;

    /**
     * Registra un nuevo usuario en el sistema.
     *
     * @param userRequest DTO con la información del usuario a registrar.
     * @return El usuario creado y persistido.
     * @throws IllegalArgumentException si el nombre de usuario o el email ya existen.
     */
    @Transactional
    public User register(UserRequest userRequest) {
        userRepository
            .findByUsername(userRequest.username())
            .ifPresent(u -> {
                throw new IllegalArgumentException(
                    "Username '" + userRequest.username() + "' already exists."
                );
            });
        userRepository
            .findByEmail(userRequest.email())
            .ifPresent(u -> {
                throw new IllegalArgumentException(
                    "Email '" + userRequest.email() + "' already exists."
                );
            });

        var user = userDtoMapper.toDomain(userRequest);

        user.setPasswordHash(passwordEncoder.encode(userRequest.password()));
        user.setRole(UserRole.USER);
        user.setStatus(UserStatus.PUBLISHED);
        user.setActive(true);
        user.setImgUrl(generateGravatarUrl(user.getEmail()));

        return userRepository.save(user);
    }

    /**
     * Recupera todos los usuarios registrados.
     *
     * @return Lista de respuestas de usuario.
     */
    @Transactional(readOnly = true)
    public java.util.List<UserResponse> findAll() {
        return userDtoMapper.toResponseList(userRepository.findAll());
    }

    /**
     * Busca usuarios cuyo nombre de usuario coincida parcialmente con el término proporcionado.
     *
     * @param username Término de búsqueda.
     * @return Lista de usuarios que coinciden con la búsqueda.
     */
    @Transactional(readOnly = true)
    public java.util.List<UserResponse> searchByUsername(String username) {
        return userDtoMapper.toResponseList(userRepository.searchByUsername(username));
    }

    /**
     * Actualiza el rol de un usuario específico.
     *
     * @param username Nombre de usuario del usuario a actualizar.
     * @param role     Nuevo rol a asignar.
     * @return Respuesta del usuario actualizado.
     */
    @Transactional
    public UserResponse updateUserRole(String username, UserRole role) {
        User user = userRepository
            .findByUsername(username)
            .orElseThrow(() ->
                new IllegalArgumentException(
                    "User not found with username: " + username
                )
            );
        user.setRole(role);
        return userDtoMapper.toResponse(userRepository.save(user));
    }

    /**
     * Actualiza el estado de publicación de un usuario.
     *
     * @param username Nombre de usuario.
     * @param status   Nuevo estado (PUBLISHED, etc.).
     * @return Respuesta del usuario actualizado.
     */
    @Transactional
    public UserResponse updateUserStatus(String username, UserStatus status) {
        User user = userRepository
            .findByUsername(username)
            .orElseThrow(() ->
                new IllegalArgumentException(
                    "User not found with username: " + username
                )
            );
        user.setStatus(status);
        return userDtoMapper.toResponse(userRepository.save(user));
    }

    /**
     * Alterna el estado de activación (borrado lógico) de un usuario.
     *
     * @param username Nombre de usuario.
     * @return Respuesta del usuario con el estado 'active' invertido.
     */
    @Transactional
    public UserResponse toggleUserActive(String username) {
        User user = userRepository
            .findByUsername(username)
            .orElseThrow(() ->
                new IllegalArgumentException(
                    "User not found with username: " + username
                )
            );
        user.setActive(!user.isActive());
        return userDtoMapper.toResponse(userRepository.save(user));
    }

    // ========================
    // BÚSQUEDA POR ROL
    // ========================

    /**
     * Obtiene una lista de usuarios filtrada por su rol.
     *
     * @param role Rol por el cual filtrar.
     * @return Lista de usuarios con dicho rol.
     */
    @Transactional(readOnly = true)
    public java.util.List<UserResponse> findByRole(UserRole role) {
        return userDtoMapper.toResponseList(userRepository.findByRole(role));
    }

    /**
     * Busca usuarios por rol y coincidencia parcial de nombre de usuario.
     *
     * @param role     Rol por el cual filtrar.
     * @param username Término de búsqueda para el nombre de usuario.
     * @return Lista de usuarios que cumplen ambos criterios.
     */
    @Transactional(readOnly = true)
    public java.util.List<UserResponse> searchByRoleAndUsername(UserRole role, String username) {
        return userDtoMapper.toResponseList(userRepository.searchByRoleAndUsername(role, username));
    }

    // Generar la URL de Gravatar basada en el email del usuario
    private static String generateGravatarUrl(String email) {
        var normalized = (email == null)
            ? ""
            : email.trim().toLowerCase(Locale.ROOT);
        var hash = md5Hex(normalized);
        return (
            "https://www.gravatar.com/avatar/" + hash + "?s=200&d=identicon&r=g"
        );
    }

    private static String md5Hex(String input) {
        try {
            var md = MessageDigest.getInstance("MD5");
            var digest = md.digest(input.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("MD5 algorithm not available", e);
        }
    }
}
