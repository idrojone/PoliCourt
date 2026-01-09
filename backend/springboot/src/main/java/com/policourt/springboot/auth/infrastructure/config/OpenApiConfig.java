package com.policourt.springboot.auth.infrastructure.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI policourtOpenAPI() {
        final String securitySchemeName = "bearerAuth";

        return new OpenAPI()
            .info(new Info()
                .title("PoliCourt Identity Service API")
                .version("v1")
                .description("API de Autenticación y Usuarios para PoliCourt")
                .contact(new Contact().name("PoliCourt Team").email("dev@policourt.example")))
            .addServersItem(new Server().url("http://localhost:3000").description("Local"))
            .components(new Components()
                .addSecuritySchemes(securitySchemeName,
                    new SecurityScheme()
                        .name(securitySchemeName)
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT")))
            .addSecurityItem(new SecurityRequirement().addList(securitySchemeName));
    }
}
