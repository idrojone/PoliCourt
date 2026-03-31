package com.policourt.api.payment.infrastructure.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.policourt.api.payment.domain.enums.PaymentStatusEnum;
import com.policourt.api.payment.infrastructure.entity.PaymentEntity;

public interface PaymentJpaRepository extends JpaRepository<PaymentEntity, Long> {
    boolean existsByStripePaymentIntentId(String stripePaymentIntentId);

    Optional<PaymentEntity> findFirstByBookingIdAndStatus(Long bookingId, PaymentStatusEnum status);
}
