-- ============================================================================
-- V8: Make bookings uniqueness apply only for active bookings
-- ============================================================================

-- Drop the previously added UNIQUE constraint and index that enforced uniqueness
-- regardless of booking status/is_active. We replace it with a partial unique
-- index that only applies to bookings that are considered active.

ALTER TABLE bookings DROP CONSTRAINT IF EXISTS uq_bookings_court_time;

DROP INDEX IF EXISTS idx_bookings_court_time;
DROP INDEX IF EXISTS uq_bookings_court_time;

-- Create a partial unique index so identical (court_id, start_time, end_time)
-- are only forbidden while the booking is active (not CANCELLED/COMPLETED).
CREATE UNIQUE INDEX IF NOT EXISTS uq_bookings_court_time_active
    ON bookings (court_id, start_time, end_time)
    WHERE (status != 'CANCELLED' AND status != 'COMPLETED');

-- Note: this allows reusing the same time slot for historical/cancelled bookings
-- while still preventing duplicate active bookings for the same court and times.
