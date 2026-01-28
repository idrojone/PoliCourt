-- V1__init_polideportivo_schema.sql

-- 1. EXTENSIONES
-- Necesarias para UUIDs y para la validación de rangos de tiempo
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- 2. ENUMS
CREATE TYPE general_status AS ENUM ('PUBLISHED', 'DRAFT', 'ARCHIVED', 'SUSPENDED');

CREATE TYPE court_surface_enum AS ENUM ('HARD', 'CLAY', 'GRASS', 'SYNTHETIC', 'WOOD', 'OTHER');

CREATE TYPE user_role AS ENUM ('ADMIN', 'USER', 'COACH', 'MONITOR', 'CLUB_ADMIN');

CREATE TYPE booking_type_enum AS ENUM ('RENTAL', 'CLASS', 'TRAINING', 'TOURNAMENT', 'MAINTENANCE');

CREATE TYPE booking_status_enum AS ENUM ('CONFIRMED', 'PENDING', 'CANCELLED', 'COMPLETED');

-- 3. TABLA USERS
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    username VARCHAR(50) UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    img_url TEXT,
    role user_role NOT NULL DEFAULT 'USER',
    status general_status DEFAULT 'PUBLISHED' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABLA SPORTS
CREATE TABLE sports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    slug VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    img_url TEXT,
    status general_status DEFAULT 'PUBLISHED' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABLA COURTS
CREATE TABLE courts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
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

-- 6. TABLA COURT_SPORTS
CREATE TABLE court_sports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    court_id UUID NOT NULL REFERENCES courts (id) ON DELETE CASCADE,
    sport_id UUID NOT NULL REFERENCES sports (id) ON DELETE CASCADE,
    UNIQUE (court_id, sport_id)
);

-- 7. TABLA BOOKINGS (Tabla maestra de eventos)

CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    court_id UUID NOT NULL REFERENCES courts(id) ON DELETE CASCADE,
    organizer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, 
    
    type booking_type_enum NOT NULL DEFAULT 'RENTAL',
    
    title VARCHAR(150),
    description TEXT,
    
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    
    total_price DECIMAL(10, 2) DEFAULT 0,
    status booking_status_enum DEFAULT 'CONFIRMED' NOT NULL,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT check_dates CHECK (end_time > start_time),

-- LÓGICA ANTI-SOLAPAMIENTO POSTGRES
EXCLUDE USING GIST (
        court_id WITH =,
        tstzrange(start_time, end_time, '[)') WITH &&
    ) WHERE (status != 'CANCELLED' AND status != 'COMPLETED')
);

-- 8. TABLA BOOKING_ATTENDEES
CREATE TABLE booking_attendees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    booking_id UUID NOT NULL REFERENCES bookings (id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'CONFIRMED',
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (booking_id, user_id)
);