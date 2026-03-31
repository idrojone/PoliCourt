package com.policourt.api.payment.infrastructure.mapper;

import org.springframework.stereotype.Component;

import com.policourt.api.booking.domain.model.Booking;
import com.policourt.api.order.domain.model.Order;
import com.policourt.api.payment.domain.model.Payment;
import com.policourt.api.payment.infrastructure.entity.PaymentEntity;

@Component
public class PaymentMapper {

    public Payment toDomain(PaymentEntity entity) {
        if (entity == null) {
            return null;
        }

        return Payment.builder()
                .id(entity.getId())
                .order(Order.builder().id(entity.getOrder().getId()).build())
            .booking(Booking.builder().id(entity.getBooking().getId()).build())
                .amount(entity.getAmount())
                .currency(entity.getCurrency())
                .provider(entity.getProvider())
                .status(entity.getStatus())
                .stripePaymentIntentId(entity.getStripePaymentIntentId())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    public PaymentEntity toEntity(Payment payment) {
        if (payment == null) {
            return null;
        }

        return PaymentEntity.builder()
                .id(payment.getId())
                .amount(payment.getAmount())
                .currency(payment.getCurrency())
                .provider(payment.getProvider())
                .status(payment.getStatus())
                .stripePaymentIntentId(payment.getStripePaymentIntentId())
                .build();
    }

    public void updateEntity(PaymentEntity entity, Payment payment) {
        entity.setAmount(payment.getAmount());
        entity.setCurrency(payment.getCurrency());
        entity.setProvider(payment.getProvider());
        entity.setStatus(payment.getStatus());
        entity.setStripePaymentIntentId(payment.getStripePaymentIntentId());
    }
}
