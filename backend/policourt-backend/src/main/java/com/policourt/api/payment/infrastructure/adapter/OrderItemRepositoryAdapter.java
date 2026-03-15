package com.policourt.api.payment.infrastructure.adapter;

import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.policourt.api.booking.infrastructure.repository.BookingJpaRepository;
import com.policourt.api.payment.domain.model.OrderItem;
import com.policourt.api.payment.domain.repository.OrderItemRepository;
import com.policourt.api.payment.infrastructure.entity.OrderItemEntity;
import com.policourt.api.payment.infrastructure.mapper.OrderItemMapper;
import com.policourt.api.payment.infrastructure.repository.OrderItemJpaRepository;
import com.policourt.api.payment.infrastructure.repository.OrderJpaRepository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
@SuppressWarnings("null")
public class OrderItemRepositoryAdapter implements OrderItemRepository {

    private final OrderItemJpaRepository orderItemJpaRepository;
    private final OrderJpaRepository orderJpaRepository;
    private final BookingJpaRepository bookingJpaRepository;
    private final OrderItemMapper orderItemMapper;

    @Override
    public OrderItem save(OrderItem orderItem) {
        OrderItemEntity entity;

        if (orderItem.getId() != null) {
            entity = orderItemJpaRepository.findById(orderItem.getId())
                    .orElseGet(() -> orderItemMapper.toEntity(orderItem));
            orderItemMapper.updateEntity(entity, orderItem);
        } else {
            entity = orderItemMapper.toEntity(orderItem);
        }

        if (orderItem.getOrder() != null && orderItem.getOrder().getId() != null) {
            var order = orderJpaRepository.findById(orderItem.getOrder().getId())
                    .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderItem.getOrder().getId()));
            entity.setOrder(order);
        }

        if (orderItem.getBooking() != null && orderItem.getBooking().getId() != null) {
            var booking = bookingJpaRepository.findById(orderItem.getBooking().getId())
                    .orElseThrow(() -> new RuntimeException("Booking not found with id: " + orderItem.getBooking().getId()));
            entity.setBooking(booking);
        }

        return orderItemMapper.toDomain(orderItemJpaRepository.save(entity));
    }

    @Override
    public Optional<OrderItem> findByOrderIdAndBookingId(Long orderId, Long bookingId) {
        return orderItemJpaRepository.findByOrderIdAndBookingId(orderId, bookingId)
                .map(orderItemMapper::toDomain);
    }
}
