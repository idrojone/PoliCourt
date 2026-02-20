-- ============================================================================
-- V3__Add_Auth_Schema.sql
-- Adds support for advanced JWT authentication with refresh tokens.
-- ============================================================================

-- 1. Add session_version to users table
ALTER TABLE users ADD COLUMN session_version INTEGER NOT NULL DEFAULT 0;

-- 2. Create refresh_sessions table
CREATE TABLE refresh_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_id VARCHAR(255) NOT NULL,
    family_id UUID NOT NULL,
    current_token_hash VARCHAR(255) NOT NULL,
    revoked BOOLEAN NOT NULL DEFAULT FALSE,
    session_version INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Note: In PostgreSQL 13+, gen_random_uuid() is built-in.
-- Since the pg_crypto extension is loaded in V1, it's safe to use.

-- 3. Add Indexes for quick lookups and cleanup
CREATE INDEX idx_refresh_sessions_user_id ON refresh_sessions(user_id);
CREATE INDEX idx_refresh_sessions_family_id ON refresh_sessions(family_id);
