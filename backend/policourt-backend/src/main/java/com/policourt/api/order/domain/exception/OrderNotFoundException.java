package com.policourt.api.order.domain.exception;

public class OrderNotFoundException extends RuntimeException {
    public OrderNotFoundException(Long orderId) {
        super("Order no encontrada con id: " + orderId);
    }
}
