-- V7: Refund support and maintenance status extension

-- 1) Extend payment_status_enum with REFUNDED
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum
        WHERE enumlabel = 'REFUNDED'
          AND enumtypid = 'payment_status_enum'::regtype
    ) THEN
        ALTER TYPE payment_status_enum ADD VALUE 'REFUNDED';
    END IF;
END $$;

-- 2) Extend order_status_enum with REFUNDED (if exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status_enum') THEN
        IF NOT EXISTS (
            SELECT 1 FROM pg_enum
            WHERE enumlabel = 'REFUNDED'
              AND enumtypid = 'order_status_enum'::regtype
        ) THEN
            ALTER TYPE order_status_enum ADD VALUE 'REFUNDED';
        END IF;
    END IF;
END $$;

-- 3) Extend maintenance_status_enum with EXECUTED
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum
        WHERE enumlabel = 'EXECUTED'
          AND enumtypid = 'maintenance_status_enum'::regtype
    ) THEN
        ALTER TYPE maintenance_status_enum ADD VALUE 'EXECUTED';
    END IF;
END $$;

-- 4) Add booking_id to payments and backfill
ALTER TABLE payments
    ADD COLUMN IF NOT EXISTS booking_id BIGINT;

UPDATE payments p
SET booking_id = oi.booking_id
FROM order_items oi
WHERE p.booking_id IS NULL
  AND oi.order_id = p.order_id;

ALTER TABLE payments
    ALTER COLUMN booking_id SET NOT NULL;

ALTER TABLE payments
    ADD CONSTRAINT fk_payments_booking
        FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON payments(booking_id);
