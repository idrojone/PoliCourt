-- ============================================================================
-- V5: PAYMENTS, ORDERS, TICKETS + BOOKINGS INDEXES
-- ============================================================================

-- ============================================================================
-- 1. EXTEND ENUMS
-- ============================================================================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_enum
        WHERE enumlabel = 'SUCCESS'
          AND enumtypid = 'booking_status_enum'::regtype
    ) THEN
        ALTER TYPE booking_status_enum ADD VALUE 'SUCCESS';
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status_enum') THEN
        CREATE TYPE order_status_enum AS ENUM ('CREATED', 'SUCCESS', 'FAILED');
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_item_type_enum') THEN
        CREATE TYPE order_item_type_enum AS ENUM ('COURT_RESERVATION');
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status_enum') THEN
        CREATE TYPE payment_status_enum AS ENUM ('SUCCEEDED', 'FAILED');
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_provider_enum') THEN
        CREATE TYPE payment_provider_enum AS ENUM ('STRIPE');
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ticket_status_enum') THEN
        CREATE TYPE ticket_status_enum AS ENUM ('ISSUED', 'CANCELLED');
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ticket_type_enum') THEN
        CREATE TYPE ticket_type_enum AS ENUM ('COURT_RESERVATION');
    END IF;
END $$;

-- ============================================================================
-- 2. TABLES: ORDERS, ORDER_ITEMS, PAYMENTS, TICKETS
-- ============================================================================
CREATE TABLE orders (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total_amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'EUR',
    status order_status_enum NOT NULL DEFAULT 'CREATED',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_items (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    item_type order_item_type_enum NOT NULL,
    booking_id BIGINT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    price DECIMAL(10, 2) NOT NULL,
    UNIQUE (booking_id)
);

CREATE TABLE payments (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    provider payment_provider_enum NOT NULL,
    status payment_status_enum NOT NULL,
    stripe_payment_intent_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (stripe_payment_intent_id)
);

CREATE TABLE tickets (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    order_item_id BIGINT NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
    code VARCHAR(100) NOT NULL,
    type ticket_type_enum NOT NULL,
    status ticket_status_enum NOT NULL DEFAULT 'ISSUED',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (order_item_id),
    UNIQUE (code)
);

-- ============================================================================
-- 3. BOOKINGS INDEXES AND CONSTRAINTS
-- ============================================================================
ALTER TABLE bookings
    ADD CONSTRAINT uq_bookings_court_time UNIQUE (court_id, start_time, end_time);

CREATE INDEX idx_bookings_court_id ON bookings(court_id);
CREATE INDEX idx_bookings_start_time ON bookings(start_time);
CREATE INDEX idx_bookings_end_time ON bookings(end_time);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_court_time ON bookings(court_id, start_time, end_time);

-- ============================================================================
-- 4. ADDITIONAL INDEXES
-- ============================================================================
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_booking_id ON order_items(booking_id);

CREATE INDEX idx_payments_order_id ON payments(order_id);

CREATE INDEX idx_tickets_user_id ON tickets(user_id);
