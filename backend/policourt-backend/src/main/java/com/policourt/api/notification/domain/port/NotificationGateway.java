package com.policourt.api.notification.domain.port;

import com.policourt.api.notification.domain.model.NotificationMessage;

public interface NotificationGateway {
    void send(NotificationMessage notification);
}
