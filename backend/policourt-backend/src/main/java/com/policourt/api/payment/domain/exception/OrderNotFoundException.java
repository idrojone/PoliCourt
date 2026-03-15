package com.policourt.api.payment.domain.exception;

public class OrderNotFoundException extends RuntimeException {
    public OrderNotFoundException(Long orderId) {
        super("Order no encontrada con id: " + orderId);
    }
}
