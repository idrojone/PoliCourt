package com.policourt.api.shared.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.policourt.api.auth.domain.exception.UnauthorizedException;

@Component
public class SecurityOverrideService {

    @Value("${app.security.jwt-check.enabled:true}")
    private boolean jwtCheckEnabled;

    @Value("${app.security.admin-check.enabled:true}")
    private boolean adminCheckEnabled;

    public void verifyJwtValid() {
        if (!jwtCheckEnabled) {
            return;
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated() || authentication instanceof AnonymousAuthenticationToken) {
            throw new UnauthorizedException("Token JWT inválido o no proporcionado");
        }
    }

    public void verifyAdmin() {
        verifyJwtValid();
        if (!adminCheckEnabled) {
            return;
        }

        verifyRole("ROLE_ADMIN", "ADMIN");
    }

    public void verifyCoach() {
        verifyJwtValid();
        verifyRole("ROLE_COACH", "COACH");
    }

    public void verifyMonitor() {
        verifyJwtValid();
        verifyRole("ROLE_MONITOR", "MONITOR");
    }

    public void verifyClubAdmin() {
        verifyJwtValid();
        verifyRole("ROLE_CLUB_ADMIN", "CLUB_ADMIN");
    }

    public void verifyAdminOrSameUser(String username) {
        verifyJwtValid();

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(grantedAuthority -> "ROLE_ADMIN".equals(grantedAuthority.getAuthority()));

        if (isAdmin) {
            return;
        }

        Object principal = authentication.getPrincipal();
        String authenticatedUsername = null;
        String authenticatedEmail = null;

        if (principal instanceof CustomUserDetails customUserDetails) {
            authenticatedUsername = customUserDetails.getUser().getUsername();
            authenticatedEmail = customUserDetails.getUser().getEmail();
        } else if (principal instanceof org.springframework.security.core.userdetails.User springUser) {
            authenticatedUsername = springUser.getUsername();
            authenticatedEmail = springUser.getUsername();
        } else if (principal instanceof String principalString) {
            authenticatedUsername = principalString;
            authenticatedEmail = principalString;
        }

        if (authenticatedUsername == null && authenticatedEmail == null) {
            throw new UnauthorizedException("Acceso denegado: solo ADMIN o el mismo usuario puede acceder");
        }

        boolean allowed = false;

        if (authenticatedUsername != null && authenticatedUsername.equalsIgnoreCase(username)) {
            allowed = true;
        }

        if (!allowed && authenticatedEmail != null && authenticatedEmail.equalsIgnoreCase(username)) {
            allowed = true;
        }

        if (!allowed) {
            throw new UnauthorizedException("Acceso denegado: solo ADMIN o el mismo usuario puede acceder");
        }
    }

    private void verifyRole(String roleAuthority, String roleName) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        boolean hasRole = authentication.getAuthorities().stream()
                .anyMatch(grantedAuthority -> roleAuthority.equals(grantedAuthority.getAuthority()));

        if (!hasRole) {
            throw new UnauthorizedException("Acceso denegado: se requiere rol " + roleName);
        }
    }
}
