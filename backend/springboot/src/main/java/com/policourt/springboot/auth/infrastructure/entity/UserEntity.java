package com.policourt.springboot.auth.infrastructure.entity;

import com.policourt.springboot.auth.domain.enums.UserRole;
import com.policourt.springboot.auth.domain.enums.UserStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

/**
 * Entidad JPA que representa a un usuario en la base de datos.
 * Mapea la tabla 'users' y contiene la información de autenticación y perfil básico.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
@EntityListeners(AuditingEntityListener.class)
public class UserEntity {

    /** Identificador único del usuario (UUID). */
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /** Nombre de usuario único en el sistema. */
    @Column(unique = true)
    private String username;

    /** Correo electrónico único del usuario. */
    @Column(nullable = false, unique = true)
    private String email;

    /** Hash de la contraseña del usuario (BCrypt/Argon2). */
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    /** Nombre de pila del usuario. */
    @Column(name = "first_name", nullable = false)
    private String firstName;

    /** Apellido del usuario. */
    @Column(name = "last_name", nullable = false)
    private String lastName;

    /** Número de teléfono de contacto (opcional). */
    private String phone;

    /** URL de la imagen de perfil o avatar. */
    @Column(name = "img_url")
    private String imgUrl;

    /** Rol del usuario en el sistema (ADMIN, PLAYER, etc.). */
    @Column(nullable = false, columnDefinition = "user_role")
    @Enumerated(EnumType.STRING)
    @JdbcType(PostgreSQLEnumJdbcType.class)
    private UserRole role;

    /** Estado actual del usuario (PUBLISHED, DRAFT, etc.). */
    @Column(name = "status", columnDefinition = "general_status")
    @Enumerated(EnumType.STRING)
    @JdbcType(PostgreSQLEnumJdbcType.class)
    private UserStatus status;

    /** Indicador de si la cuenta está activa o ha sido desactivada (borrado lógico). */
    @Column(name = "is_active")
    private boolean isActive;

    /** Fecha y hora de creación del registro (auditoría). */
    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    /** Fecha y hora de la última modificación del registro (auditoría). */
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
