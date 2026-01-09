package com.policourt.springboot;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordHashGeneratorTest {

    @Test
    public void generatePasswordHash() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String password = "123456789";
        String hash = encoder.encode(password);

        System.out.println("=".repeat(60));
        System.out.println("Password: " + password);
        System.out.println("BCrypt Hash: " + hash);
        System.out.println("=".repeat(60));

        // Verificar que el hash funciona
        boolean matches = encoder.matches(password, hash);
        System.out.println("Verification: " + (matches ? "SUCCESS" : "FAILED"));
        System.out.println("=".repeat(60));
    }
}
