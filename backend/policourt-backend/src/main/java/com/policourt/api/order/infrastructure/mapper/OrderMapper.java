package com.policourt.api.order.infrastructure.mapper;

import org.springframework.stereotype.Component;

import com.policourt.api.order.domain.model.Order;
import com.policourt.api.order.infrastructure.entity.OrderEntity;
import com.policourt.api.user.infrastructure.mapper.UserMapper;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OrderMapper {

    private final UserMapper userMapper;

    public Order toDomain(OrderEntity entity) {
        if (entity == null) {
            return null;
        }

        return Order.builder()
                .id(entity.getId())
                .user(userMapper.toDomain(entity.getUser()))
                .totalAmount(entity.getTotalAmount())
                .currency(entity.getCurrency())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public OrderEntity toEntity(Order order) {
        if (order == null) {
            return null;
        }

        return OrderEntity.builder()
                .id(order.getId())
                .totalAmount(order.getTotalAmount())
                .currency(order.getCurrency())
                .status(order.getStatus())
                .build();
    }

    public void updateEntity(OrderEntity entity, Order order) {
        entity.setTotalAmount(order.getTotalAmount());
        entity.setCurrency(order.getCurrency());
        entity.setStatus(order.getStatus());
    }
}
