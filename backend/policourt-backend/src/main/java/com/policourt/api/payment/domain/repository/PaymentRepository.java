package com.policourt.api.payment.domain.repository;

import com.policourt.api.payment.domain.model.Payment;

public interface PaymentRepository {
    Payment save(Payment payment);

    boolean existsByStripePaymentIntentId(String stripePaymentIntentId);
}
