package com.policourt.springboot;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Desactivamos CSRF para permitir peticiones POST, PUT, DELETE sin tokens
                // adicionales
                .csrf(AbstractHttpConfigurer::disable)

                // Configuración de rutas
                .authorizeHttpRequests(auth -> auth
                        // .requestMatchers("/api/public/**").permitAll() // Descomenta si quieres
                        // permitir solo rutas específicas

                        // Permite el acceso a CUALQUIER ruta sin autenticación
                        .anyRequest().permitAll());

        return http.build();
    }
}
