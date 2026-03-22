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

    private void verifyRole(String roleAuthority, String roleName) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        boolean hasRole = authentication.getAuthorities().stream()
                .anyMatch(grantedAuthority -> roleAuthority.equals(grantedAuthority.getAuthority()));

        if (!hasRole) {
            throw new UnauthorizedException("Acceso denegado: se requiere rol " + roleName);
        }
    }
}
