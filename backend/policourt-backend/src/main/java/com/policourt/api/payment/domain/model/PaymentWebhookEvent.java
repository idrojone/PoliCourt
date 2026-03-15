package com.policourt.api.payment.domain.model;

import java.math.BigDecimal;

import com.policourt.api.payment.domain.model.enums.PaymentWebhookEventType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentWebhookEvent {
    private PaymentWebhookEventType type;
    private String paymentIntentId;
    private Long orderId;
    private Long bookingId;
    private BigDecimal amount;
    private String currency;
}
