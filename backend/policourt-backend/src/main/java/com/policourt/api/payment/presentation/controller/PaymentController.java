package com.policourt.api.payment.presentation.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.policourt.api.payment.application.PaymentService;
import com.policourt.api.payment.domain.model.CreateClassEnrollmentPaymentIntentCommand;
import com.policourt.api.payment.domain.model.CreatePaymentIntentCommand;
import com.policourt.api.payment.presentation.request.ClassEnrollmentPaymentIntentCreateRequest;
import com.policourt.api.payment.presentation.request.PaymentIntentCreateRequest;
import com.policourt.api.payment.presentation.response.PaymentIntentCreateResponse;
import com.policourt.api.shared.response.ApiResponse;
import com.policourt.api.shared.security.CustomUserDetails;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Tag(name = "Payments", description = "Endpoints de pagos con Stripe")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/intent")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Crear PaymentIntent", description = "Crea una reserva PENDING y devuelve el clientSecret")
    public ResponseEntity<ApiResponse<PaymentIntentCreateResponse>> createPaymentIntent(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Datos de la reserva") @RequestBody @Valid PaymentIntentCreateRequest request) {

        var command = CreatePaymentIntentCommand.builder()
                .courtSlug(request.getCourtSlug())
                .organizerUsername(request.getOrganizerUsername())
                .sportSlug(request.getSportSlug())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .build();

        var result = paymentService.createCourtReservationPayment(command);
        var response = new PaymentIntentCreateResponse(result.getClientSecret(), result.getOrderId(), result.getBookingUuid());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "PaymentIntent creado exitosamente"));
    }

    @PostMapping("/intent/class")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Crear PaymentIntent de inscripción a clase", description = "Crea un PaymentIntent para inscribirse en una clase existente")
    public ResponseEntity<ApiResponse<PaymentIntentCreateResponse>> createClassEnrollmentIntent(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Datos de la inscripción") @RequestBody @Valid ClassEnrollmentPaymentIntentCreateRequest request,
            @AuthenticationPrincipal Object principal) {

        String attendeeUsername = resolveAttendeeUsername(principal);

        var command = CreateClassEnrollmentPaymentIntentCommand.builder()
                .bookingUuid(request.getBookingUuid())
                .attendeeUsername(attendeeUsername)
                .build();

        var result = paymentService.createClassEnrollmentPayment(command);
        var response = new PaymentIntentCreateResponse(result.getClientSecret(), result.getOrderId(), result.getBookingUuid());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "PaymentIntent creado exitosamente"));
    }

    private String resolveAttendeeUsername(Object principal) {
        if (principal instanceof CustomUserDetails userDetails) {
            return userDetails.getUser().getUsername();
        }
        if (principal instanceof org.springframework.security.core.userdetails.User springUser) {
            return springUser.getUsername();
        }
        if (principal instanceof String username) {
            return username;
        }
        throw new IllegalArgumentException("No se pudo determinar el usuario autenticado");
    }

    @PostMapping(value = "/webhook/stripe", consumes = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Webhook Stripe", description = "Confirma la reserva y emite tickets")
    public ResponseEntity<ApiResponse<Void>> stripeWebhook(
            @Parameter(description = "Stripe signature") @RequestHeader("Stripe-Signature") String signature,
            @RequestBody String payload) {
        System.out.println("Received Stripe webhook: " + payload);
        paymentService.handleWebhook(payload, signature);
        return ResponseEntity.ok(ApiResponse.success(null, "Webhook recibido"));
    }
}
