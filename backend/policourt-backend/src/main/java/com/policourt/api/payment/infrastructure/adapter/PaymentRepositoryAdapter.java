package com.policourt.api.payment.infrastructure.adapter;

import org.springframework.stereotype.Repository;

import com.policourt.api.booking.infrastructure.repository.BookingJpaRepository;
import com.policourt.api.order.infrastructure.repository.OrderJpaRepository;
import com.policourt.api.payment.domain.enums.PaymentStatusEnum;
import com.policourt.api.payment.domain.model.Payment;
import com.policourt.api.payment.domain.repository.PaymentRepository;
import com.policourt.api.payment.infrastructure.entity.PaymentEntity;
import com.policourt.api.payment.infrastructure.mapper.PaymentMapper;
import com.policourt.api.payment.infrastructure.repository.PaymentJpaRepository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
@SuppressWarnings("null")
public class PaymentRepositoryAdapter implements PaymentRepository {

    private final PaymentJpaRepository paymentJpaRepository;
    private final OrderJpaRepository orderJpaRepository;
    private final BookingJpaRepository bookingJpaRepository;
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

        if (payment.getBooking() != null && payment.getBooking().getId() != null) {
            var booking = bookingJpaRepository.findById(payment.getBooking().getId())
                    .orElseThrow(() -> new RuntimeException("Booking not found with id: " + payment.getBooking().getId()));
            entity.setBooking(booking);
        }

        return paymentMapper.toDomain(paymentJpaRepository.save(entity));
    }

    @Override
    public boolean existsByStripePaymentIntentId(String stripePaymentIntentId) {
        return paymentJpaRepository.existsByStripePaymentIntentId(stripePaymentIntentId);
    }

    @Override
    public java.util.Optional<Payment> findFirstByBookingIdAndStatus(Long bookingId, PaymentStatusEnum status) {
        return paymentJpaRepository.findFirstByBookingIdAndStatus(bookingId, status)
                .map(paymentMapper::toDomain);
    }
}
