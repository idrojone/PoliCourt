package com.policourt.api.payment.infrastructure.adapter;

import org.springframework.stereotype.Repository;

import com.policourt.api.payment.domain.model.Payment;
import com.policourt.api.payment.domain.repository.PaymentRepository;
import com.policourt.api.payment.infrastructure.entity.PaymentEntity;
import com.policourt.api.payment.infrastructure.mapper.PaymentMapper;
import com.policourt.api.payment.infrastructure.repository.OrderJpaRepository;
import com.policourt.api.payment.infrastructure.repository.PaymentJpaRepository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
@SuppressWarnings("null")
public class PaymentRepositoryAdapter implements PaymentRepository {

    private final PaymentJpaRepository paymentJpaRepository;
    private final OrderJpaRepository orderJpaRepository;
    private final PaymentMapper paymentMapper;

    @Override
    public Payment save(Payment payment) {
        PaymentEntity entity;

        if (payment.getId() != null) {
            entity = paymentJpaRepository.findById(payment.getId())
                    .orElseGet(() -> paymentMapper.toEntity(payment));
            paymentMapper.updateEntity(entity, payment);
        } else {
            entity = paymentMapper.toEntity(payment);
        }

        if (payment.getOrder() != null && payment.getOrder().getId() != null) {
            var order = orderJpaRepository.findById(payment.getOrder().getId())
                    .orElseThrow(() -> new RuntimeException("Order not found with id: " + payment.getOrder().getId()));
            entity.setOrder(order);
        }

        return paymentMapper.toDomain(paymentJpaRepository.save(entity));
    }

    @Override
    public boolean existsByStripePaymentIntentId(String stripePaymentIntentId) {
        return paymentJpaRepository.existsByStripePaymentIntentId(stripePaymentIntentId);
    }
}
