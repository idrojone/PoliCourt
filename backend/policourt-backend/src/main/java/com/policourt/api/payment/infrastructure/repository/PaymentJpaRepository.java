package com.policourt.api.payment.infrastructure.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.policourt.api.payment.infrastructure.entity.PaymentEntity;

public interface PaymentJpaRepository extends JpaRepository<PaymentEntity, Long> {
    boolean existsByStripePaymentIntentId(String stripePaymentIntentId);
}
