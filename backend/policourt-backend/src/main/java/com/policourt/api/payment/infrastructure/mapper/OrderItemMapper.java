package com.policourt.api.payment.infrastructure.mapper;

import org.springframework.stereotype.Component;

import com.policourt.api.booking.domain.model.Booking;
import com.policourt.api.payment.domain.model.Order;
import com.policourt.api.payment.domain.model.OrderItem;
import com.policourt.api.payment.infrastructure.entity.OrderItemEntity;

@Component
public class OrderItemMapper {

    public OrderItem toDomain(OrderItemEntity entity) {
        if (entity == null) {
            return null;
        }

        return OrderItem.builder()
                .id(entity.getId())
                .order(Order.builder().id(entity.getOrder().getId()).build())
                .booking(Booking.builder().id(entity.getBooking().getId()).build())
                .itemType(entity.getItemType())
                .price(entity.getPrice())
                .build();
    }

    public OrderItemEntity toEntity(OrderItem orderItem) {
        if (orderItem == null) {
            return null;
        }

        return OrderItemEntity.builder()
                .id(orderItem.getId())
                .itemType(orderItem.getItemType())
                .price(orderItem.getPrice())
                .build();
    }

    public void updateEntity(OrderItemEntity entity, OrderItem orderItem) {
        entity.setItemType(orderItem.getItemType());
        entity.setPrice(orderItem.getPrice());
    }
}
