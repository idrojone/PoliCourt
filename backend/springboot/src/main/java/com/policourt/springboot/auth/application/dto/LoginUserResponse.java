package com.policourt.springboot.auth.application.dto;

// import org.springframework.boot.autoconfigure.batch.BatchDataSource;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginUserResponse {
    private String accessToken;
    private String refreshToken;
    private UserResponse user;
}
