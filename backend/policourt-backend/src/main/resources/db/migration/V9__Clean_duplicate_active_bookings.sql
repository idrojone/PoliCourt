-- ============================================================================
-- V9: Clean duplicate active bookings (mark duplicates as CANCELLED)
-- ============================================================================
-- This migration finds bookings that share the same (court_id, start_time, end_time)
-- while being considered active by the partial unique index (status != 'CANCELLED' AND status != 'COMPLETED')
-- and marks all but the earliest-created row as CANCELLED and inactive. This allows the
-- partial unique index to be enforced without failing due to historical duplicates.

WITH duplicates AS (
    SELECT id,
           ROW_NUMBER() OVER (PARTITION BY court_id, start_time, end_time ORDER BY created_at ASC, id ASC) AS rn
    FROM bookings
    WHERE (status != 'CANCELLED' AND status != 'COMPLETED')
)
UPDATE bookings
SET status = 'CANCELLED',
    is_active = false,
    updated_at = NOW()
WHERE id IN (
    SELECT id FROM duplicates WHERE rn > 1
);

-- Optional: you can inspect affected rows after running this migration with:
-- SELECT id, uuid, court_id, start_time, end_time, status, is_active, created_at FROM bookings
-- WHERE (status = 'CANCELLED' AND is_active = false) AND updated_at > NOW() - INTERVAL '1 hour';
