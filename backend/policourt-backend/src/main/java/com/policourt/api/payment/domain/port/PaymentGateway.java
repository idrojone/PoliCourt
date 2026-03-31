package com.policourt.api.payment.domain.port;

import com.policourt.api.payment.domain.model.PaymentIntentResult;
import com.policourt.api.payment.domain.model.PaymentWebhookEvent;
import com.policourt.api.payment.domain.model.PaymentRefundResult;

public interface PaymentGateway {
    PaymentIntentResult createPaymentIntent(long amountInCents, String currency, Long orderId, Long bookingId);

    PaymentWebhookEvent parseWebhookEvent(String payload, String signature);

    PaymentRefundResult refund(String paymentIntentId, long amountInCents);
}
