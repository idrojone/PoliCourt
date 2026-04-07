package com.policourt.api.shared.infrastructure.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.util.stream.Collectors;

import com.policourt.api.auth.domain.exception.AccountInactiveException;
import com.policourt.api.auth.domain.exception.AuthenticationFailedException;
import com.policourt.api.auth.domain.exception.EmailAlreadyExistsException;
import com.policourt.api.auth.domain.exception.TokenRefreshException;
import com.policourt.api.auth.domain.exception.UnauthorizedException;
import com.policourt.api.auth.domain.exception.UsernameAlreadyExistsException;
import com.policourt.api.booking.domain.exception.BookingConcurrencyException;
import com.policourt.api.booking.domain.exception.BookingSlotUnavailableException;
import com.policourt.api.booking.domain.exception.SportNotAllowedForCourtException;
import com.policourt.api.order.domain.exception.OrderNotFoundException;
import com.policourt.api.payment.domain.exception.PaymentMetadataMissingException;
import com.policourt.api.payment.domain.exception.PaymentWebhookInvalidSignatureException;
import com.policourt.api.shared.response.ApiResponse;

import com.policourt.api.sport.domain.exception.SportAlreadyExistsException;
import com.policourt.api.sport.domain.exception.SportNotFoundException;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(SportNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleSportNotFoundException(SportNotFoundException ex) {
        log.error("Sport not found: {}", ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(ex.getMessage()));
    }

    @ExceptionHandler(com.policourt.api.court.domain.exception.CourtNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleCourtNotFoundException(
            com.policourt.api.court.domain.exception.CourtNotFoundException ex) {
        log.error("Court not found: {}", ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(ex.getMessage()));
    }

    @ExceptionHandler(com.policourt.api.club.domain.exception.ClubNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleClubNotFoundException(
            com.policourt.api.club.domain.exception.ClubNotFoundException ex) {
        log.error("Club not found: {}", ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(ex.getMessage()));
    }

    @ExceptionHandler(com.policourt.api.booking.domain.exception.BookingNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleBookingNotFoundException(
            com.policourt.api.booking.domain.exception.BookingNotFoundException ex) {
        log.error("Booking not found: {}", ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(ex.getMessage()));
    }

    @ExceptionHandler(com.policourt.api.booking.domain.exception.BookingTypeMismatchException.class)
    public ResponseEntity<ApiResponse<Void>> handleBookingTypeMismatchException(
            com.policourt.api.booking.domain.exception.BookingTypeMismatchException ex) {
        log.error("Booking type mismatch: {}", ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(ex.getMessage()));
    }

    @ExceptionHandler(com.policourt.api.booking.domain.exception.UserNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleUserNotFoundException(
            com.policourt.api.booking.domain.exception.UserNotFoundException ex) {
        log.error("User not found: {}", ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(ex.getMessage()));
    }

        @ExceptionHandler(BookingSlotUnavailableException.class)
        public ResponseEntity<ApiResponse<Void>> handleBookingSlotUnavailable(BookingSlotUnavailableException ex) {
                log.error("Booking slot unavailable: {}", ex.getMessage());
                return ResponseEntity
                                .status(HttpStatus.CONFLICT)
                                .body(ApiResponse.error(ex.getMessage()));
        }

        @ExceptionHandler(org.springframework.dao.DataIntegrityViolationException.class)
        public ResponseEntity<ApiResponse<Void>> handleDataIntegrity(org.springframework.dao.DataIntegrityViolationException ex) {
                log.error("Data integrity violation: {}", ex.getMessage());
                return ResponseEntity
                                .status(HttpStatus.CONFLICT)
                                .body(ApiResponse.error("Slot ya reservado (conflicto de integridad de datos)"));
        }

        @ExceptionHandler(BookingConcurrencyException.class)
        public ResponseEntity<ApiResponse<Void>> handleBookingConcurrency(BookingConcurrencyException ex) {
                log.error("Booking concurrency error: {}", ex.getMessage());
                return ResponseEntity
                                .status(HttpStatus.SERVICE_UNAVAILABLE)
                                .body(ApiResponse.error(ex.getMessage()));
        }

        @ExceptionHandler(SportNotAllowedForCourtException.class)
        public ResponseEntity<ApiResponse<Void>> handleSportNotAllowedForCourt(SportNotAllowedForCourtException ex) {
                log.error("Sport not allowed for court: {}", ex.getMessage());
                return ResponseEntity
                                .status(HttpStatus.BAD_REQUEST)
                                .body(ApiResponse.error(ex.getMessage()));
        }

        @ExceptionHandler(OrderNotFoundException.class)
        public ResponseEntity<ApiResponse<Void>> handleOrderNotFound(OrderNotFoundException ex) {
                log.error("Order not found: {}", ex.getMessage());
                return ResponseEntity
                                .status(HttpStatus.NOT_FOUND)
                                .body(ApiResponse.error(ex.getMessage()));
        }

        @ExceptionHandler(PaymentWebhookInvalidSignatureException.class)
        public ResponseEntity<ApiResponse<Void>> handleWebhookInvalidSignature(PaymentWebhookInvalidSignatureException ex) {
                log.error("Invalid Stripe webhook signature: {}", ex.getMessage());
                return ResponseEntity
                                .status(HttpStatus.BAD_REQUEST)
                                .body(ApiResponse.error(ex.getMessage()));
        }

        @ExceptionHandler(PaymentMetadataMissingException.class)
        public ResponseEntity<ApiResponse<Void>> handlePaymentMetadataMissing(PaymentMetadataMissingException ex) {
                log.error("Payment metadata missing: {}", ex.getMessage());
                return ResponseEntity
                                .status(HttpStatus.BAD_REQUEST)
                                .body(ApiResponse.error(ex.getMessage()));
        }

    @ExceptionHandler(SportAlreadyExistsException.class)
    public ResponseEntity<ApiResponse<Void>> handleSportAlreadyExistsException(SportAlreadyExistsException ex) {
        log.error("Sport already exists: {}", ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(ApiResponse.error(ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        String errorMessage = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.joining(", "));
        log.error("Validation error: {}", errorMessage);
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error("Error de validación: " + errorMessage));
    }

    @ExceptionHandler(AccountInactiveException.class)
    public ResponseEntity<ApiResponse<Void>> handleAccountInactive(AccountInactiveException ex) {
        log.error("Account inactive or not published: {}", ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ApiResponse.error(ex.getMessage()));
    }

    @ExceptionHandler(AuthenticationFailedException.class)
    public ResponseEntity<ApiResponse<Void>> handleAuthFailed(AuthenticationFailedException ex) {
        log.error("Authentication failed: {}", ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error(ex.getMessage()));
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ApiResponse<Void>> handleUnauthorized(UnauthorizedException ex) {
        log.error("Unauthorized access: {}", ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error(ex.getMessage()));
    }

    @ExceptionHandler(TokenRefreshException.class)
    public ResponseEntity<ApiResponse<Void>> handleTokenRefresh(TokenRefreshException ex) {
        log.error("Refresh error: {}", ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error(ex.getMessage()));
    }

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<ApiResponse<Void>> handleEmailAlreadyExists(EmailAlreadyExistsException ex) {
        log.error("Email already exists: {}", ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(ApiResponse.error(ex.getMessage()));
    }

    @ExceptionHandler(UsernameAlreadyExistsException.class)
    public ResponseEntity<ApiResponse<Void>> handleUsernameAlreadyExists(UsernameAlreadyExistsException ex) {
        log.error("Username already exists: {}", ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(ApiResponse.error(ex.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Void>> handleIllegalArgumentException(IllegalArgumentException ex) {
        log.error("Validation error: {}", ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(ex.getMessage()));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse<Void>> handleRuntimeException(RuntimeException ex) {
        log.error("Runtime error: ", ex);
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(ex.getMessage() != null ? ex.getMessage() : "Ocurrió un error inesperado"));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleException(Exception ex) {
        log.error("Unexpected error: ", ex);
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error interno del servidor"));
    }
}
