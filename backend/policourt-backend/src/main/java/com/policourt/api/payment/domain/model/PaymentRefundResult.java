package com.policourt.api.payment.domain.model;

import com.policourt.api.payment.domain.enums.PaymentStatusEnum;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRefundResult {
    private String refundId;
    private PaymentStatusEnum status;
}
