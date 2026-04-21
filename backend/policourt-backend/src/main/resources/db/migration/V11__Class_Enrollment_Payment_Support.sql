-- ============================================================================
-- V11: CLASS ENROLLMENT SUPPORT
-- ============================================================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_enum
        WHERE enumlabel = 'CLASS_ENROLLMENT'
          AND enumtypid = 'order_item_type_enum'::regtype
    ) THEN
        ALTER TYPE order_item_type_enum ADD VALUE 'CLASS_ENROLLMENT';
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_enum
        WHERE enumlabel = 'CLASS_ENROLLMENT'
          AND enumtypid = 'ticket_type_enum'::regtype
    ) THEN
        ALTER TYPE ticket_type_enum ADD VALUE 'CLASS_ENROLLMENT';
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conrelid = 'order_items'::regclass
          AND conname = 'order_items_booking_id_key'
    ) THEN
        ALTER TABLE order_items DROP CONSTRAINT order_items_booking_id_key;
    END IF;
END $$;
