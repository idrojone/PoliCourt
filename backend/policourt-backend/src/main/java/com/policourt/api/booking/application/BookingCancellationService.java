package com.policourt.api.booking.application;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.OffsetDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.policourt.api.booking.domain.enums.BookingStatusEnum;
import com.policourt.api.booking.domain.exception.BookingCancellationNotAllowedException;
import com.policourt.api.booking.domain.exception.BookingNotFoundException;
import com.policourt.api.booking.domain.model.Booking;
import com.policourt.api.booking.application.model.BookingCancellationResult;
import com.policourt.api.booking.domain.repository.BookingRepository;
import com.policourt.api.notification.application.NotificationService;
import com.policourt.api.notification.domain.model.NotificationMessage;
import com.policourt.api.order.domain.enums.OrderStatusEnum;
import com.policourt.api.order.domain.exception.OrderNotFoundException;
import com.policourt.api.order.domain.model.Order;
import com.policourt.api.order.domain.repository.OrderRepository;
import com.policourt.api.orderitem.domain.model.OrderItem;
import com.policourt.api.orderitem.domain.repository.OrderItemRepository;
import com.policourt.api.payment.domain.enums.PaymentStatusEnum;
import com.policourt.api.payment.domain.model.Payment;
import com.policourt.api.payment.domain.port.PaymentGateway;
import com.policourt.api.payment.domain.repository.PaymentRepository;
import com.policourt.api.tickets.domain.enums.TicketStatusEnum;
import com.policourt.api.tickets.domain.model.Ticket;
import com.policourt.api.tickets.domain.repository.TicketRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookingCancellationService {

    private static final long REFUND_THRESHOLD_MINUTES = 180L;
    private static final String DEFAULT_TONE = "empresarial";
    private static final String CANCELLATION_TASK = "Cancelación de reserva";

    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final TicketRepository ticketRepository;
    private final PaymentGateway paymentGateway;
    private final NotificationService notificationService;

    @Transactional
    public BookingCancellationResult cancelByUser(String bookingUuid, String username) {
        Booking booking = bookingRepository.findByUuid(bookingUuid)
                .orElseThrow(() -> new BookingNotFoundException(bookingUuid));

        if (booking.getOrganizer() == null || booking.getOrganizer().getUsername() == null
                || !booking.getOrganizer().getUsername().equals(username)) {
            throw new BookingCancellationNotAllowedException("Solo el organizador puede cancelar la reserva");
        }

        return cancelBooking(booking, false, "Cancelación solicitada por el usuario");
    }

    @Transactional
    public BookingCancellationResult cancelByMaintenance(Booking booking, String reason) {
        return cancelBooking(booking, true, reason != null ? reason : "Cancelación por mantenimiento");
    }

    private BookingCancellationResult cancelBooking(Booking booking, boolean forceRefund, String reason) {
        if (booking.getIsActive() != null && !booking.getIsActive()) {
            throw new BookingCancellationNotAllowedException("La reserva ya no está activa");
        }

        if (booking.getStatus() == BookingStatusEnum.CANCELLED) {
            throw new BookingCancellationNotAllowedException("La reserva ya fue cancelada");
        }

        boolean refundable = forceRefund || isRefundWindowOpen(booking.getStartTime());
        OffsetDateTime now = OffsetDateTime.now();

        OrderItem orderItem = orderItemRepository.findByBookingId(booking.getId())
                .orElseThrow(() -> new BookingCancellationNotAllowedException("No se encontró el pedido asociado"));

        Order order = orderRepository.findById(orderItem.getOrder().getId())
                .orElseThrow(() -> new OrderNotFoundException(orderItem.getOrder().getId()));

        Ticket ticket = ticketRepository.findByBookingId(booking.getId()).orElse(null);

        boolean refunded = false;
        if (refundable) {
            refunded = processRefund(booking, order);
        }

        booking.setStatus(BookingStatusEnum.CANCELLED);
        booking.setIsActive(false);
        booking.setUpdatedAt(now);
        booking = bookingRepository.saveBooking(booking);

        if (!refundable && order.getStatus() == OrderStatusEnum.CREATED) {
            order.setStatus(OrderStatusEnum.FAILED);
        }

        if (refundable && refunded) {
            order.setStatus(OrderStatusEnum.REFUNDED);
        }
        order.setUpdatedAt(now);
        order = orderRepository.save(order);

        if (ticket != null) {
            ticket.setStatus(TicketStatusEnum.CANCELLED);
            ticketRepository.save(ticket);
        }

        sendNotification(booking, order, refunded, reason);

        return BookingCancellationResult.builder()
                .booking(booking)
                .refunded(refunded)
                .build();
    }

    private boolean processRefund(Booking booking, Order order) {
        if (paymentRepository.findFirstByBookingIdAndStatus(booking.getId(), PaymentStatusEnum.REFUNDED).isPresent()) {
            return true;
        }

        Payment payment = paymentRepository.findFirstByBookingIdAndStatus(booking.getId(), PaymentStatusEnum.SUCCEEDED)
                .orElse(null);

        if (payment == null) {
            return false;
        }

        payment.setBooking(booking);

        long amountInCents = payment.getAmount()
                .multiply(BigDecimal.valueOf(100))
                .setScale(0, RoundingMode.HALF_UP)
                .longValueExact();

        paymentGateway.refund(payment.getStripePaymentIntentId(), amountInCents);

        payment.setStatus(PaymentStatusEnum.REFUNDED);
        paymentRepository.save(payment);

        if (order.getStatus() == OrderStatusEnum.SUCCESS) {
            order.setStatus(OrderStatusEnum.REFUNDED);
        }

        return true;
    }

    private boolean isRefundWindowOpen(OffsetDateTime startTime) {
        long minutesUntilStart = Duration.between(OffsetDateTime.now(), startTime).toMinutes();
        return minutesUntilStart >= REFUND_THRESHOLD_MINUTES;
    }

    private void sendNotification(Booking booking, Order order, boolean refunded, String reason) {
        if (booking.getOrganizer() == null || booking.getOrganizer().getEmail() == null) {
            return;
        }

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("reason", reason);
        data.put("refunded", refunded);
        data.put("bookingUuid", booking.getUuid() != null ? booking.getUuid().toString() : null);
        data.put("bookingStartTime", booking.getStartTime());
        data.put("bookingEndTime", booking.getEndTime());
        data.put("courtName", booking.getCourt() != null ? booking.getCourt().getName() : null);
        data.put("orderId", order.getId());
        data.put("orderAmount", order.getTotalAmount());

        NotificationMessage notification = NotificationMessage.builder()
                .email(booking.getOrganizer().getEmail())
                .taskDescription(CANCELLATION_TASK)
                .tone(DEFAULT_TONE)
                .data(data)
                .build();

        notificationService.sendCustomEmail(notification);
    }
}
