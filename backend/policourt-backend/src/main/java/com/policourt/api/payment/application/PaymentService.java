package com.policourt.api.payment.application;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.OffsetDateTime;
import java.util.UUID;
import java.time.Duration;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import java.sql.SQLException;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.TransactionException;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.transaction.annotation.Transactional;

import com.policourt.api.booking.domain.enums.BookingStatusEnum;
import com.policourt.api.booking.domain.enums.BookingTypeEnum;
import com.policourt.api.booking.domain.exception.BookingConcurrencyException;
import com.policourt.api.booking.domain.exception.BookingNotFoundException;
import com.policourt.api.booking.domain.exception.BookingSlotUnavailableException;
import com.policourt.api.booking.domain.exception.SportNotAllowedForCourtException;
import com.policourt.api.booking.domain.exception.UserNotFoundException;
import com.policourt.api.booking.domain.model.Booking;
import com.policourt.api.booking.domain.repository.BookingRepository;
import com.policourt.api.court.domain.exception.CourtNotFoundException;
import com.policourt.api.court.domain.repository.CourtRepository;
import com.policourt.api.courtsport.domain.repository.CourtSportRepository;
import com.policourt.api.order.domain.enums.OrderStatusEnum;
import com.policourt.api.order.domain.exception.OrderNotFoundException;
import com.policourt.api.order.domain.model.Order;
import com.policourt.api.order.domain.repository.OrderRepository;
import com.policourt.api.orderitem.domain.enums.OrderItemTypeEnum;
import com.policourt.api.orderitem.domain.model.OrderItem;
import com.policourt.api.orderitem.domain.repository.OrderItemRepository;
import com.policourt.api.payment.domain.enums.PaymentProviderEnum;
import com.policourt.api.payment.domain.enums.PaymentStatusEnum;
import com.policourt.api.payment.domain.enums.PaymentWebhookEventType;
import com.policourt.api.payment.domain.model.CreatePaymentIntentCommand;
import com.policourt.api.payment.domain.model.Payment;
import com.policourt.api.payment.domain.model.PaymentIntentCreation;
import com.policourt.api.payment.domain.model.PaymentIntentResult;
import com.policourt.api.payment.domain.model.PaymentWebhookEvent;
import com.policourt.api.payment.domain.port.PaymentGateway;
import com.policourt.api.payment.domain.repository.PaymentRepository;
import com.policourt.api.sport.domain.exception.SportNotFoundException;
import com.policourt.api.sport.domain.repository.SportRepository;
import com.policourt.api.tickets.domain.enums.TicketStatusEnum;
import com.policourt.api.tickets.domain.enums.TicketTypeEnum;
import com.policourt.api.tickets.domain.model.Ticket;
import com.policourt.api.tickets.domain.repository.TicketRepository;
import com.policourt.api.user.domain.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class PaymentService {

    private static final int MAX_RETRIES = 5;
    private static final String DEFAULT_CURRENCY = "EUR";

    private final BookingRepository bookingRepository;
    private final CourtRepository courtRepository;
    private final UserRepository userRepository;
    private final SportRepository sportRepository;
    private final CourtSportRepository courtSportRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final PaymentRepository paymentRepository;
    private final TicketRepository ticketRepository;
    private final PaymentGateway paymentGateway;
    private final PlatformTransactionManager transactionManager;

    public PaymentIntentCreation createCourtReservationPayment(CreatePaymentIntentCommand command) {
        for (int attempt = 0; attempt < MAX_RETRIES; attempt++) {
            try {
                TransactionTemplate template = new TransactionTemplate(transactionManager);
                template.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRED);
                template.setIsolationLevel(TransactionDefinition.ISOLATION_SERIALIZABLE);

                PaymentIntentCreation result = template.execute(status -> createPaymentIntentInTx(command));
                if (result != null) {
                    return result;
                }
            } catch (DataIntegrityViolationException ex) {
                throw new BookingSlotUnavailableException();
            } catch (DataAccessException ex) {
                String sqlState = extractSqlState(ex);
                if ("40001".equals(sqlState)) {
                    continue;
                }
                if ("55P03".equals(sqlState)) {
                    throw new BookingSlotUnavailableException();
                }
                throw ex;
            } catch (TransactionException ex) {
                throw ex;
            }
        }

        throw new BookingConcurrencyException();
    }

    @Transactional
    public void handleWebhook(String payload, String signature) {
        PaymentWebhookEvent event = paymentGateway.parseWebhookEvent(payload, signature);

        if (event.getType() == PaymentWebhookEventType.IGNORED) {
            return;
        }

        if (event.getType() == PaymentWebhookEventType.PAYMENT_SUCCEEDED) {
            handlePaymentSucceeded(event);
            return;
        }

        if (event.getType() == PaymentWebhookEventType.PAYMENT_FAILED) {
            handlePaymentFailed(event);
        }
    }

    private PaymentIntentCreation createPaymentIntentInTx(CreatePaymentIntentCommand command) {
        var court = courtRepository.findBySlug(command.getCourtSlug())
                .orElseThrow(() -> new CourtNotFoundException(command.getCourtSlug()));
        var organizer = userRepository.findByUsername(command.getOrganizerUsername())
                .orElseThrow(() -> new UserNotFoundException(command.getOrganizerUsername()));
        var sport = sportRepository.findBySlug(command.getSportSlug())
                .orElseThrow(() -> new SportNotFoundException(command.getSportSlug()));

        boolean sportAllowed = courtSportRepository.existsByCourtIdAndSportId(court.getId(), sport.getId());
        if (!sportAllowed) {
            throw new SportNotAllowedForCourtException();
        }

        bookingRepository.lockSlotNowait(court.getId(), command.getStartTime(), command.getEndTime());

        if (bookingRepository.existsActiveBookingForCourtAndTime(court.getId(), command.getStartTime(), command.getEndTime())) {
            throw new BookingSlotUnavailableException();
        }

        BigDecimal totalPrice = calculateTotalPrice(court.getPriceH(), command.getStartTime(), command.getEndTime());

        Booking booking = Booking.builder()
            .uuid(UUID.randomUUID())
                .court(court)
                .organizer(organizer)
                .type(BookingTypeEnum.RENTAL)
                .startTime(command.getStartTime())
                .endTime(command.getEndTime())
            .totalPrice(totalPrice)
                .status(BookingStatusEnum.PENDING)
                .isActive(true)
                .createdAt(OffsetDateTime.now())
                .updatedAt(OffsetDateTime.now())
                .build();

        booking = bookingRepository.saveBooking(booking);

        Order order = Order.builder()
                .user(organizer)
            .totalAmount(totalPrice)
                .currency(DEFAULT_CURRENCY)
                .status(OrderStatusEnum.CREATED)
                .createdAt(OffsetDateTime.now())
                .updatedAt(OffsetDateTime.now())
                .build();

        order = orderRepository.save(order);

        OrderItem orderItem = OrderItem.builder()
                .order(order)
                .booking(booking)
                .itemType(OrderItemTypeEnum.COURT_RESERVATION)
            .price(totalPrice)
                .build();
        orderItemRepository.save(orderItem);

        long amountInCents = totalPrice
                .multiply(BigDecimal.valueOf(100))
                .setScale(0, RoundingMode.HALF_UP)
                .longValueExact();

        PaymentIntentResult paymentIntent = paymentGateway.createPaymentIntent(
                amountInCents,
                DEFAULT_CURRENCY.toLowerCase(),
                order.getId(),
                booking.getId());

        return PaymentIntentCreation.builder()
                .clientSecret(paymentIntent.getClientSecret())
                .orderId(order.getId())
                .bookingUuid(booking.getUuid().toString())
                .build();
    }

    private void handlePaymentSucceeded(PaymentWebhookEvent event) {
        if (paymentRepository.existsByStripePaymentIntentId(event.getPaymentIntentId())) {
            return;
        }

        Order order = orderRepository.findById(event.getOrderId())
                .orElseThrow(() -> new OrderNotFoundException(event.getOrderId()));

        if (order.getStatus() == OrderStatusEnum.SUCCESS) {
            return;
        }

        paymentRepository.save(Payment.builder()
                .order(order)
                .amount(event.getAmount())
                .currency(event.getCurrency())
                .provider(PaymentProviderEnum.STRIPE)
                .status(PaymentStatusEnum.SUCCEEDED)
                .stripePaymentIntentId(event.getPaymentIntentId())
                .createdAt(OffsetDateTime.now())
                .build());

        order.setStatus(OrderStatusEnum.SUCCESS);
        order.setUpdatedAt(OffsetDateTime.now());
        orderRepository.save(order);

        Booking booking = bookingRepository.findById(event.getBookingId())
                .orElseThrow(() -> new BookingNotFoundException(String.valueOf(event.getBookingId())));
        booking.setStatus(BookingStatusEnum.SUCCESS);
        booking.setUpdatedAt(OffsetDateTime.now());
        bookingRepository.saveBooking(booking);

        OrderItem orderItem = orderItemRepository.findByOrderIdAndBookingId(order.getId(), booking.getId())
                .orElseThrow(() -> new RuntimeException("Order item not found for order: " + order.getId()));

        if (ticketRepository.existsByOrderItemId(orderItem.getId())) {
            return;
        }

        Ticket ticket = Ticket.builder()
                .user(order.getUser())
                .orderItem(orderItem)
                .code("TCK-" + orderItem.getId())
                .type(TicketTypeEnum.COURT_RESERVATION)
                .status(TicketStatusEnum.ISSUED)
                .createdAt(OffsetDateTime.now())
                .build();
        ticketRepository.save(ticket);
    }

    private void handlePaymentFailed(PaymentWebhookEvent event) {
        if (!paymentRepository.existsByStripePaymentIntentId(event.getPaymentIntentId())) {
            Order order = orderRepository.findById(event.getOrderId())
                    .orElseThrow(() -> new OrderNotFoundException(event.getOrderId()));

            paymentRepository.save(Payment.builder()
                    .order(order)
                    .amount(event.getAmount())
                    .currency(event.getCurrency())
                    .provider(PaymentProviderEnum.STRIPE)
                    .status(PaymentStatusEnum.FAILED)
                    .stripePaymentIntentId(event.getPaymentIntentId())
                    .createdAt(OffsetDateTime.now())
                    .build());
        }

        Order order = orderRepository.findById(event.getOrderId())
                .orElseThrow(() -> new OrderNotFoundException(event.getOrderId()));
        if (order.getStatus() == OrderStatusEnum.SUCCESS) {
            return;
        }

        order.setStatus(OrderStatusEnum.FAILED);
        order.setUpdatedAt(OffsetDateTime.now());
        orderRepository.save(order);

        Booking booking = bookingRepository.findById(event.getBookingId())
                .orElseThrow(() -> new BookingNotFoundException(String.valueOf(event.getBookingId())));
        booking.setStatus(BookingStatusEnum.CANCELLED);
        booking.setIsActive(false);
        booking.setUpdatedAt(OffsetDateTime.now());
        bookingRepository.saveBooking(booking);
    }

    private String extractSqlState(Throwable ex) {
        Throwable current = ex;
        while (current != null) {
            if (current instanceof SQLException sqlEx) {
                return sqlEx.getSQLState();
            }
            current = current.getCause();
        }
        return null;
    }

    private BigDecimal calculateTotalPrice(BigDecimal pricePerHour, OffsetDateTime startTime, OffsetDateTime endTime) {
        if (pricePerHour == null) {
            return BigDecimal.ZERO;
        }

        long minutes = Duration.between(startTime, endTime).toMinutes();
        if (minutes <= 0) {
            throw new IllegalArgumentException("El rango de horas es invalido");
        }

        BigDecimal hours = BigDecimal.valueOf(minutes)
                .divide(BigDecimal.valueOf(60), 2, RoundingMode.HALF_UP);
        return pricePerHour.multiply(hours).setScale(2, RoundingMode.HALF_UP);
    }
}
