package com.policourt.api.payment.infrastructure.adapter;

import java.math.BigDecimal;

import org.springframework.stereotype.Component;

import com.policourt.api.payment.domain.enums.PaymentStatusEnum;
import com.policourt.api.payment.domain.enums.PaymentWebhookEventType;
import com.policourt.api.payment.domain.exception.PaymentMetadataMissingException;
import com.policourt.api.payment.domain.exception.PaymentWebhookInvalidSignatureException;
import com.policourt.api.payment.domain.model.PaymentIntentResult;
import com.policourt.api.payment.domain.model.PaymentRefundResult;
import com.policourt.api.payment.domain.model.PaymentWebhookEvent;
import com.policourt.api.payment.domain.port.PaymentGateway;
import com.policourt.api.payment.infrastructure.config.StripeProperties;
import com.stripe.exception.InvalidRequestException;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.model.Refund;
import com.stripe.net.Webhook;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.RefundCreateParams;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class StripePaymentGateway implements PaymentGateway {

    private final StripeProperties stripeProperties;

    @Override
    public PaymentIntentResult createPaymentIntent(long amountInCents, String currency, Long orderId, Long bookingId) {
        try {
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(amountInCents)
                    .setCurrency(currency)
                    .putMetadata("orderId", String.valueOf(orderId))
                    .putMetadata("bookingId", String.valueOf(bookingId))
                    .build();

            PaymentIntent paymentIntent = PaymentIntent.create(params);
            return PaymentIntentResult.builder()
                    .id(paymentIntent.getId())
                    .clientSecret(paymentIntent.getClientSecret())
                    .build();
        } catch (StripeException ex) {
            throw new RuntimeException("Error creando PaymentIntent", ex);
        }
    }

    @Override
    public PaymentWebhookEvent parseWebhookEvent(String payload, String signature) {
        try {
            Event event = Webhook.constructEvent(payload, signature, stripeProperties.getWebhookSecret());

            if ("payment_intent.succeeded".equals(event.getType())) {
                return buildEvent(event, PaymentWebhookEventType.PAYMENT_SUCCEEDED);
            }

            if ("payment_intent.payment_failed".equals(event.getType())) {
                return buildEvent(event, PaymentWebhookEventType.PAYMENT_FAILED);
            }

            return PaymentWebhookEvent.builder().type(PaymentWebhookEventType.IGNORED).build();
        } catch (SignatureVerificationException ex) {
            throw new PaymentWebhookInvalidSignatureException();
        }
    }

    private PaymentWebhookEvent buildEvent(Event event, PaymentWebhookEventType type) {
        PaymentIntent intent = null;

        try {
            intent = (PaymentIntent) event.getDataObjectDeserializer().getObject().orElse(null);

            if (intent == null) {
                intent = (PaymentIntent) event.getDataObjectDeserializer().deserializeUnsafe();
            }
        } catch (com.stripe.exception.EventDataObjectDeserializationException e) {
            throw new PaymentMetadataMissingException();
        }

        if (intent == null || intent.getMetadata() == null) {
            throw new PaymentMetadataMissingException();
        }

        String orderId = intent.getMetadata().get("orderId");
        String bookingId = intent.getMetadata().get("bookingId");

        if (orderId == null || bookingId == null) {
            throw new PaymentMetadataMissingException();
        }

        Long amountReceived = intent.getAmountReceived() != null ? intent.getAmountReceived() : 0L;
        BigDecimal amount = BigDecimal.valueOf(amountReceived).movePointLeft(2);

        return PaymentWebhookEvent.builder()
                .type(type)
                .paymentIntentId(intent.getId())
                .orderId(Long.valueOf(orderId))
                .bookingId(Long.valueOf(bookingId))
                .amount(amount)
                .currency(intent.getCurrency())
                .build();
    }

    @Override
    public PaymentRefundResult refund(String paymentIntentId, long amountInCents) {
        try {
            RefundCreateParams params = RefundCreateParams.builder()
                    .setPaymentIntent(paymentIntentId)
                    .setAmount(amountInCents)
                    .build();

            Refund refund = Refund.create(params);

            return PaymentRefundResult.builder()
                    .refundId(refund.getId())
                    .status(PaymentStatusEnum.REFUNDED)
                    .build();
        } catch (InvalidRequestException ex) {
            if ("charge_already_refunded".equals(ex.getCode())) {
                return PaymentRefundResult.builder()
                        .refundId(null)
                        .status(PaymentStatusEnum.REFUNDED)
                        .build();
            }
            throw new RuntimeException("Error creando reembolso en Stripe", ex);
        } catch (StripeException ex) {
            throw new RuntimeException("Error creando reembolso en Stripe", ex);
        }
    }
}
