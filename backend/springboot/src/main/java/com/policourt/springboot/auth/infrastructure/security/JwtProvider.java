package com.policourt.springboot.auth.infrastructure.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class JwtProvider {
    
    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private Long jwtExpiration;

    @Value("${jwt.refreshExpiration}")
    private Long refreshExpiration;

    private SecretKey getSigningKey() {
         return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(Authentication authentication) {
    UserDetails userPrincipal = (UserDetails) authentication.getPrincipal();
    List<String> roles = authentication.getAuthorities().stream()
        .map(GrantedAuthority::getAuthority)          // e.g. "ROLE_ADMIN" o "ADMIN"
        .map(r -> r.startsWith("ROLE_") ? r.substring(5) : r) // normalizamos sin prefijo
        .collect(Collectors.toList());
    return buildToken(userPrincipal.getUsername(), roles, jwtExpiration);
}

    public String generateRefreshToken(Authentication authentication) {
        UserDetails userPrincipal = (UserDetails) authentication.getPrincipal();
        List<String> roles = authentication.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .map(r -> r.startsWith("ROLE_") ? r.substring(5) : r)
            .collect(Collectors.toList());
        return buildToken(userPrincipal.getUsername(), roles, refreshExpiration);
    }

    public String generateToken(String username) {
        return buildToken(username, jwtExpiration);
    }

    public String generateToken(String username, List<String> roles) {
        return buildToken(username, roles, jwtExpiration);
    }

    public String generateRefreshToken(String username) {
        return buildToken(username, refreshExpiration);
    }

    public String generateRefreshToken(String username, List<String> roles) {
        return buildToken(username, roles, refreshExpiration);
    }

    private String buildToken(String username, Long expiration) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + expiration))
                .signWith(getSigningKey())
                .compact();
    }

    private String buildToken(String username, List<String> roles, Long expiration) {
        return Jwts.builder()
                .setSubject(username)
                .claim("roles", roles)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey())
                .compact();
    }

    public java.util.List<String> getRolesFromToken(String token) {
        Claims claims = Jwts.parserBuilder().setSigningKey(getSigningKey()).build()
                .parseClaimsJws(token).getBody();
        Object rolesObj = claims.get("roles");
        if (rolesObj instanceof java.util.List<?>) {
            return ((java.util.List<?>) rolesObj).stream().map(Object::toString).collect(Collectors.toList());
        }
        return java.util.List.of();
    }

    public String getUsernameFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(authToken);
            return true;
        } catch (SignatureException e) {
            log.error("Invalid JWT signature: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            log.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            log.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.error("JWT claims string is empty: {}", e.getMessage());
        }
        return false;
    }
}
