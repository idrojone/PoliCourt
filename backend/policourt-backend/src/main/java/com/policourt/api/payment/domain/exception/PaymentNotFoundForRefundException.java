package com.policourt.api.payment.domain.exception;

public class PaymentNotFoundForRefundException extends RuntimeException {
    public PaymentNotFoundForRefundException() {
        super("No se encontró un pago exitoso para realizar el reembolso");
    }
}
