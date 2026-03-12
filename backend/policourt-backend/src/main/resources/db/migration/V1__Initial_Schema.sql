-- ============================================================================
-- POLIDEPORTIVO - CONSOLIDATED SCHEMA
-- ============================================================================

-- ============================================================================
-- 1. EXTENSIONS
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- ============================================================================
-- 2. ENUMS
-- ============================================================================
CREATE TYPE general_status AS ENUM ('PUBLISHED', 'DRAFT', 'ARCHIVED', 'SUSPENDED');
CREATE TYPE court_surface_enum AS ENUM ('HARD', 'CLAY', 'GRASS', 'SYNTHETIC', 'WOOD', 'OTHER');
CREATE TYPE user_role AS ENUM ('ADMIN', 'USER', 'COACH', 'MONITOR', 'CLUB_ADMIN');
CREATE TYPE booking_type_enum AS ENUM ('RENTAL', 'CLASS', 'TRAINING');
CREATE TYPE booking_status_enum AS ENUM ('CONFIRMED', 'PENDING', 'CANCELLED', 'COMPLETED');
CREATE TYPE maintenance_status_enum AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- ============================================================================
-- 3. TABLE: USERS
-- ============================================================================
CREATE TABLE users (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username VARCHAR(50) UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(20),
    avatar_url TEXT,
    role user_role NOT NULL DEFAULT 'USER',
    status general_status DEFAULT 'PUBLISHED' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_email_verified BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 4. TABLE: SPORTS
-- ============================================================================
CREATE TABLE sports (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    slug VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    img_url TEXT,
    status general_status DEFAULT 'PUBLISHED' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 5. TABLE: COURTS
-- ============================================================================
CREATE TABLE courts (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    slug VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL UNIQUE,
    location_details TEXT,
    img_url TEXT,
    price_h DECIMAL(10, 2) NOT NULL DEFAULT 0,
    capacity INTEGER NOT NULL DEFAULT 4,
    is_indoor BOOLEAN NOT NULL DEFAULT FALSE,
    surface court_surface_enum NOT NULL DEFAULT 'HARD',
    status general_status DEFAULT 'PUBLISHED' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 6. TABLE: COURT_SPORTS
-- ============================================================================
CREATE TABLE court_sports (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    court_id BIGINT NOT NULL REFERENCES courts(id) ON DELETE CASCADE,
    sport_id BIGINT NOT NULL REFERENCES sports(id) ON DELETE CASCADE,
    UNIQUE (court_id, sport_id)
);

-- ============================================================================
-- 7. TABLE: BOOKINGS
-- ============================================================================
CREATE TABLE bookings (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    uuid UUID UNIQUE NOT NULL,
    court_id BIGINT NOT NULL REFERENCES courts(id) ON DELETE CASCADE,
    organizer_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sport_id BIGINT REFERENCES sports(id) ON DELETE RESTRICT,
    type booking_type_enum NOT NULL DEFAULT 'RENTAL',
    title VARCHAR(150),
    description TEXT,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    total_price DECIMAL(10, 2) DEFAULT 0,
    attendee_price DECIMAL(10, 2) DEFAULT 0,
    status booking_status_enum DEFAULT 'CONFIRMED' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT check_dates CHECK (end_time > start_time),
    
    -- Sport is required for CLASS and TRAINING bookings
    CONSTRAINT check_sport_required CHECK (
        (type IN ('CLASS', 'TRAINING') AND sport_id IS NOT NULL) OR
        (type = 'RENTAL' AND sport_id IS NULL)
    ),
    
    -- Anti-overlapping logic for court bookings
    EXCLUDE USING GIST (
        court_id WITH =,
        tstzrange(start_time, end_time, '[)') WITH &&
    ) WHERE (status != 'CANCELLED' AND status != 'COMPLETED')
);

COMMENT ON COLUMN bookings.attendee_price IS 'Precio que debe pagar cada asistente por inscribirse (aplica principalmente a CLASS)';
COMMENT ON COLUMN bookings.sport_id IS 'Deporte asociado a la reserva (obligatorio para CLASS y TRAINING, NULL para RENTAL)';

-- Index for active bookings
CREATE INDEX idx_bookings_is_active ON bookings(is_active);

-- Index for sport-related bookings
CREATE INDEX idx_bookings_sport_id ON bookings(sport_id);

-- ============================================================================
-- 8. TABLE: BOOKING_ATTENDEES
-- ============================================================================
CREATE TABLE booking_attendees (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    booking_id BIGINT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'CONFIRMED',
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (booking_id, user_id)
);

-- ============================================================================
-- 9. TABLE: COURT_MAINTENANCES
-- ============================================================================
CREATE TABLE court_maintenances (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    uuid UUID UNIQUE NOT NULL,
    court_id BIGINT NOT NULL REFERENCES courts(id) ON DELETE CASCADE,
    created_by BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    status maintenance_status_enum DEFAULT 'SCHEDULED' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT check_maintenance_dates CHECK (end_time > start_time)
);

-- Indexes for court_maintenances
CREATE INDEX idx_court_maintenances_court_id ON court_maintenances(court_id);
CREATE INDEX idx_court_maintenances_dates ON court_maintenances(start_time, end_time);
CREATE INDEX idx_court_maintenances_status ON court_maintenances(status);

-- ============================================================================
-- 10. SEED DATA: USERS
-- ============================================================================
-- Password for all users: '12341234'

INSERT INTO users (email, username, password_hash, first_name, last_name, role, status, is_active)
VALUES 
    ('admin@admin.com', 'admin', crypt('12341234', gen_salt('bf')), 'Admin', 'System', 'ADMIN', 'PUBLISHED', true),
    ('clubadmin@policourt.com', 'clubadmin', crypt('12341234', gen_salt('bf')), 'Carlos', 'Dueño', 'CLUB_ADMIN', 'PUBLISHED', true),
    ('coach@policourt.com', 'coach', crypt('12341234', gen_salt('bf')), 'Marcelo', 'Entrenador', 'COACH', 'PUBLISHED', true),
    ('monitor@policourt.com', 'monitor', crypt('12341234', gen_salt('bf')), 'Juan', 'Monitor', 'MONITOR', 'PUBLISHED', true),
    ('player@policourt.com', 'player', crypt('12341234', gen_salt('bf')), 'Lionel', 'Jugador', 'USER', 'PUBLISHED', true);

-- ============================================================================
-- 11. SEED DATA: SPORTS
-- ============================================================================
INSERT INTO sports (slug, name, description, img_url, status, is_active)
VALUES 
    ('tennis', 'Tenis', 'Deporte de raqueta disputado en una pista rectangular.', '/src/assets/tennis.jpg', 'PUBLISHED', true),
    ('padel', 'Pádel', 'Deporte de paleta disputado en una pista cerrada.', '/src/assets/padel.jpg', 'PUBLISHED', true),
    ('basketball', 'Baloncesto', 'Deporte de equipo jugado en pista cubierta.', '/src/assets/basketball.jpg', 'PUBLISHED', true),
    ('soccer', 'Fútbol', 'Deporte de equipo jugado en campo de césped.', '/src/assets/soccer.jpg', 'PUBLISHED', true);

-- ============================================================================
-- 12. SEED DATA: COURTS AND COURT_SPORTS
-- ============================================================================
DO $$
DECLARE
    -- Sport IDs
    tennis_id BIGINT;
    padel_id BIGINT;
    basketball_id BIGINT;
    soccer_id BIGINT;
    
    -- Court IDs
    court_tenis_1_id BIGINT;
    court_tenis_2_id BIGINT;
    court_padel_1_id BIGINT;
    court_multiusos_id BIGINT;
BEGIN
    -- Get sport IDs
    SELECT id INTO tennis_id FROM sports WHERE slug = 'tennis';
    SELECT id INTO padel_id FROM sports WHERE slug = 'padel';
    SELECT id INTO basketball_id FROM sports WHERE slug = 'basketball';
    SELECT id INTO soccer_id FROM sports WHERE slug = 'soccer';

    -- Insert courts
    INSERT INTO courts (slug, name, price_h, capacity, is_indoor, surface)
    VALUES ('pista-tenis-tierra', 'Pista de Tenis 1 (Tierra Batida)', 15.50, 4, false, 'CLAY') 
    RETURNING id INTO court_tenis_1_id;

    INSERT INTO courts (slug, name, price_h, capacity, is_indoor, surface)
    VALUES ('pista-tenis-rapida', 'Pista de Tenis 2 (Rápida)', 18.00, 4, true, 'HARD') 
    RETURNING id INTO court_tenis_2_id;

    INSERT INTO courts (slug, name, price_h, capacity, is_indoor, surface)
    VALUES ('pista-padel-cristal', 'Pista de Pádel 1 (Cristal)', 20.00, 4, true, 'SYNTHETIC') 
    RETURNING id INTO court_padel_1_id;

    INSERT INTO courts (slug, name, price_h, capacity, is_indoor, surface, location_details)
    VALUES ('pista-multiusos-indoor', 'Pista Multiusos (Interior)', 25.00, 10, true, 'WOOD', 'Pista apta para baloncesto y fútbol sala.') 
    RETURNING id INTO court_multiusos_id;

    -- Associate courts with sports
    INSERT INTO court_sports (court_id, sport_id)
    VALUES
        (court_tenis_1_id, tennis_id),
        (court_tenis_2_id, tennis_id),
        (court_padel_1_id, padel_id),
        (court_multiusos_id, basketball_id),
        (court_multiusos_id, soccer_id);
END $$;