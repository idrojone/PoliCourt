package com.policourt.api.payment.domain.model;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import com.policourt.api.booking.domain.model.Booking;
import com.policourt.api.order.domain.model.Order;
import com.policourt.api.payment.domain.enums.PaymentProviderEnum;
import com.policourt.api.payment.domain.enums.PaymentStatusEnum;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Payment {
    private Long id;
    private Order order;
    private Booking booking;
    private BigDecimal amount;
    private String currency;
    private PaymentProviderEnum provider;
    private PaymentStatusEnum status;
    private String stripePaymentIntentId;
    private OffsetDateTime createdAt;
}
