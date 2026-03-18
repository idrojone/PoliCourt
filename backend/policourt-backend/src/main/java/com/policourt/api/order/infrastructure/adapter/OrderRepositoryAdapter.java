package com.policourt.api.order.infrastructure.adapter;

import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.policourt.api.order.domain.model.Order;
import com.policourt.api.order.domain.repository.OrderRepository;
import com.policourt.api.order.infrastructure.entity.OrderEntity;
import com.policourt.api.order.infrastructure.mapper.OrderMapper;
import com.policourt.api.order.infrastructure.repository.OrderJpaRepository;
import com.policourt.api.user.infrastructure.repository.UserJpaRepository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
@SuppressWarnings("null")
public class OrderRepositoryAdapter implements OrderRepository {

    private final OrderJpaRepository orderJpaRepository;
    private final UserJpaRepository userJpaRepository;
    private final OrderMapper orderMapper;

    @Override
    public Order save(Order order) {
        OrderEntity entity;

        if (order.getId() != null) {
            entity = orderJpaRepository.findById(order.getId())
                    .orElseGet(() -> orderMapper.toEntity(order));
            orderMapper.updateEntity(entity, order);
        } else {
            entity = orderMapper.toEntity(order);
        }

        if (order.getUser() != null && order.getUser().getId() != null) {
            var user = userJpaRepository.findById(order.getUser().getId())
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + order.getUser().getId()));
            entity.setUser(user);
        }

        return orderMapper.toDomain(orderJpaRepository.save(entity));
    }

    @Override
    public Optional<Order> findById(Long id) {
        return orderJpaRepository.findById(id).map(orderMapper::toDomain);
    }
}
