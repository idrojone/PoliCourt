package com.policourt.api.payment.domain.exception;

public class PaymentMetadataMissingException extends RuntimeException {
    public PaymentMetadataMissingException() {
        super("Metadata de pago incompleta");
    }
}
