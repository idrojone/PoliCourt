-- ============================================================================
-- V2: CLUB IMPLEMENTATION
-- ============================================================================

-- ============================================================================
-- 1. TABLE: CLUBS
-- ============================================================================
CREATE TABLE clubs (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    slug VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    img_url TEXT,
    sport_id BIGINT NOT NULL REFERENCES sports(id) ON DELETE RESTRICT,
    status general_status DEFAULT 'PUBLISHED' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for club lookups
CREATE INDEX idx_clubs_slug ON clubs(slug);
CREATE INDEX idx_clubs_sport_id ON clubs(sport_id);
CREATE INDEX idx_clubs_status ON clubs(status);

-- ============================================================================
-- 2. TABLE: CLUB_MEMBERS
-- ============================================================================
CREATE TABLE club_members (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    club_id BIGINT NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'MEMBER', -- ADMIN, COACH, MEMBER
    status general_status DEFAULT 'PUBLISHED' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE (club_id, user_id)
);

-- Indexes for member lookups
CREATE INDEX idx_club_members_club_id ON club_members(club_id);
CREATE INDEX idx_club_members_user_id ON club_members(user_id);
CREATE INDEX idx_club_members_role ON club_members(role);

-- ============================================================================
-- 3. MODIFY TABLE: BOOKINGS (For Club Trainings)
-- ============================================================================
-- Add club_id to associate a booking (Training) with a Club
ALTER TABLE bookings 
ADD COLUMN club_id BIGINT REFERENCES clubs(id) ON DELETE CASCADE;

-- Index for club bookings
CREATE INDEX idx_bookings_club_id ON bookings(club_id);

-- COMMENT: organizer_id in bookings table will represent the COACH who organizes/leads the session.

-- ============================================================================
-- 4. SEED DATA
-- ============================================================================
DO $$
DECLARE
    -- Sport IDs
    tennis_id BIGINT;
    padel_id BIGINT;
    soccer_id BIGINT;
    basketball_id BIGINT;
BEGIN
    -- Get sport IDs
    SELECT id INTO tennis_id FROM sports WHERE slug = 'tennis';
    SELECT id INTO padel_id FROM sports WHERE slug = 'padel';
    SELECT id INTO soccer_id FROM sports WHERE slug = 'soccer';
    SELECT id INTO basketball_id FROM sports WHERE slug = 'basketball';

    -- Insert Clubs
    INSERT INTO clubs (slug, name, description, img_url, sport_id, status, is_active)
    VALUES 
        ('club-tenis-barcelona', 'Club Tenis Barcelona', 'El mejor club de tenis de la ciudad.', 'https://example.com/club-tenis.jpg', tennis_id, 'PUBLISHED', true),
        ('padel-indoor-center', 'Padel Indoor Center', 'Pistas de pádel cubiertas de última generación.', 'https://example.com/padel-indoor.jpg', padel_id, 'PUBLISHED', true),
        ('club-baloncesto-municipal', 'Club Baloncesto Municipal', 'Entrenamientos y competiciones para todas las edades.', 'https://example.com/basket-club.jpg', basketball_id, 'PUBLISHED', true),
        ('escuela-futbol-norte', 'Escuela de Fútbol Norte', 'Formando futuros campeones.', 'https://example.com/futbol-escolar.jpg', soccer_id, 'PUBLISHED', true);

END $$;
