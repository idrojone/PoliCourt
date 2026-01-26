package com.policourt.springboot;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final CorsConfigurationSource corsConfigurationSource;

    public SecurityConfig(CorsConfigurationSource corsConfigurationSource) {
        this.corsConfigurationSource = corsConfigurationSource;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
        throws Exception {
        http
            // Aplicar la configuración de CORS
            .cors(cors -> cors.configurationSource(corsConfigurationSource))
            // Desactivamos CSRF para permitir peticiones POST, PUT, DELETE sin tokens
            // adicionales
            .csrf(AbstractHttpConfigurer::disable)
            // Configuración de rutas
            .authorizeHttpRequests(auth ->
                auth
                    // .requestMatchers("/api/public/**").permitAll() // Descomenta si quieres
                    // permitir solo rutas específicas

                    // Permite el acceso a CUALQUIER ruta sin autenticación
                    .anyRequest()
                    .permitAll()
            );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
