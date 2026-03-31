package com.policourt.api.notification.infrastructure.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Data;

@Data
@ConfigurationProperties(prefix = "notification.service")
public class NotificationProperties {
    private String baseUrl;
    private String emailPath = "/notifications/email";
}
