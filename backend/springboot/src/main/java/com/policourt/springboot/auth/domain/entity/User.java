package com.policourt.springboot.auth.domain.entity;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.UuidGenerator;

import com.policourt.springboot.auth.domain.enums.UserRole;
import com.policourt.springboot.auth.domain.enums.UserStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import io.hypersistence.utils.hibernate.type.json.JsonBinaryType;

@Entity
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(columnNames = "email")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = { "passwordHash" }) // Exclud e sensitive/complex fields
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class User {

    @Id
    @UuidGenerator(style = UuidGenerator.Style.TIME)
    @Column(name = "id", updatable = false, nullable = false)
    @EqualsAndHashCode.Include
    private UUID id;

    @Column(name = "email", nullable = false, length = 255)
    private String email;

    @Column(name = "username", length = 100)
    private String username;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "full_name", nullable = false, length = 150)
    private String fullName;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 20)
    @Builder.Default
    private UserRole role = UserRole.PLAYER;

    @Type(JsonBinaryType.class)
    @Column(name = "profile", columnDefinition = "jsonb")
    @Builder.Default
    private Map<String, Object> profile = new HashMap<>();

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20)
    @Builder.Default
    private UserStatus status = UserStatus.ACTIVE;

    @Column(name = "last_login")
    private LocalDateTime lastLogin;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    // Falta Club
    // @ManyToOne(fetch = FetchType.LAZY)
    // @JoinColumn(name = "club_id", foreignKey = @ForeignKey(name = "fk_user_club"))
    // private Club club;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Helper methods for profile management
    public void addProfileData(String key, Object value) {
        if (this.profile == null) {
            this.profile = new HashMap<>();
        }
        this.profile.put(key, value);
    }

    public Object getProfileData(String key) {
        return this.profile != null ? this.profile.get(key) : null;
    }

    public void removeProfileData(String key) {
        if (this.profile != null) {
            this.profile.remove(key);
        }
    }

    // Business methods 
    public boolean isAccountActive() {
        return Boolean.TRUE.equals(this.isActive) && UserStatus.ACTIVE.equals(this.status);
    }

    public boolean isPendingVerification() {
        return UserStatus.PENDING_VERIFICATION.equals(this.status);
    }

    public boolean isBanned() {
        return UserStatus.BANNED.equals(this.status);
    }

    public boolean isAdmin() {
        return UserRole.ADMIN.equals(this.role);
    }

    public boolean isPlayer() {
        return UserRole.PLAYER.equals(this.role);
    }

    public boolean isStaff() {
        return UserRole.STAFF.equals(this.role);
    }

    public boolean isClubAdmin() {
        return UserRole.CLUB_ADMIN.equals(this.role);
    }

    public void recordLogin() {
        this.lastLogin = LocalDateTime.now();
    }

   // Builder method
    @Builder(builderClassName = "SimpleBuilder", builderMethodName = "simpleBuilder")
    public static User createSimple(String email, String passwordHash, String fullName, UserRole role) {
        return User.builder()
                .email(email)
                .passwordHash(passwordHash)
                .fullName(fullName)
                .role(role)
                .build();
    }
}
