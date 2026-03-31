package com.policourt.api.payment.domain.repository;

import java.util.Optional;

import com.policourt.api.payment.domain.enums.PaymentStatusEnum;
import com.policourt.api.payment.domain.model.Payment;

public interface PaymentRepository {
    Payment save(Payment payment);

    boolean existsByStripePaymentIntentId(String stripePaymentIntentId);

    Optional<Payment> findFirstByBookingIdAndStatus(Long bookingId, PaymentStatusEnum status);
}
