package com.policourt.api.notification.infrastructure.adapter;

import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Objects;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.policourt.api.notification.domain.model.NotificationMessage;
import com.policourt.api.notification.domain.port.NotificationGateway;
import com.policourt.api.notification.infrastructure.config.NotificationProperties;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class NotificationGatewayAdapter implements NotificationGateway {

    private final RestTemplate notificationRestTemplate;
    private final NotificationProperties notificationProperties;

    @Override
    public void send(NotificationMessage notification) {
        Objects.requireNonNull(notificationProperties.getBaseUrl(), "notification.service.base-url no configurado");
        if (notification == null || notification.getEmail() == null) {
            return;
        }

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("email", notification.getEmail());
        payload.put("task_description", notification.getTaskDescription());
        payload.put("tone", notification.getTone());
        payload.put("data", notification.getData() != null ? notification.getData() : Collections.emptyMap());

        String url = UriComponentsBuilder.fromHttpUrl(notificationProperties.getBaseUrl())
                .path(notificationProperties.getEmailPath())
                .toUriString();

        notificationRestTemplate.postForEntity(url, payload, Void.class);
    }
}
