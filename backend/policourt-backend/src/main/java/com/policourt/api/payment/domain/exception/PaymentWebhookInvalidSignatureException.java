package com.policourt.api.payment.domain.exception;

public class PaymentWebhookInvalidSignatureException extends RuntimeException {
    public PaymentWebhookInvalidSignatureException() {
        super("Webhook de Stripe invalido");
    }
}
