-- ==================================================================================
-- 1. CONFIGURACIÓN INICIAL Y EXTENSIONES
-- ==================================================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- ==================================================================================
-- 2. DEFINICIÓN DE ENUMS Y TIPOS
-- ==================================================================================
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('ADMIN', 'USER', 'COACH', 'MONITOR', 'CLUB_ADMIN');

EXCEPTION WHEN duplicate_object THEN null;

END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE booking_status AS ENUM ('CONFIRMED', 'CANCELLED', 'COMPLETED', 'NOSHOW');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE general_status AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED', 'SUSPENDED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ==================================================================================
-- 3. FUNCIONES DE UTILIDAD Y AUDITORÍA
-- ==================================================================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Función para evitar solapamiento cruzado (Booking vs Training)
-- Esto asegura que no crees un entrenamiento encima de una reserva existente y viceversa
CREATE OR REPLACE FUNCTION check_court_availability()
RETURNS TRIGGER AS $$
DECLARE
    conflict_count INTEGER;
BEGIN
    -- Si estamos insertando en bookings, mirar en trainings
    IF TG_TABLE_NAME = 'bookings' THEN
        SELECT COUNT(*) INTO conflict_count
        FROM trainings
        WHERE court_id = NEW.court_id
          AND is_active = TRUE
          AND status = 'PUBLISHED'
          AND tstzrange(start_time, end_time) && tstzrange(NEW.start_time, NEW.end_time);
    
    -- Si estamos insertando en trainings, mirar en bookings
    ELSIF TG_TABLE_NAME = 'trainings' THEN
        SELECT COUNT(*) INTO conflict_count
        FROM bookings
        WHERE court_id = NEW.court_id
          AND is_active = TRUE
          AND status = 'CONFIRMED'
          AND tstzrange(start_time, end_time) && tstzrange(NEW.start_time, NEW.end_time);
    END IF;

    IF conflict_count > 0 THEN
        RAISE EXCEPTION 'La pista ya está ocupada por otro evento (Reserva o Entrenamiento) en este horario.';
    END IF;

    RETURN NEW;
END;
$$ language 'plpgsql';

-- ==================================================================================
-- 4. TABLAS PRINCIPALES
-- ==================================================================================

-- TABLA: USERS
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    img_url TEXT,
    role user_role NOT NULL DEFAULT 'USER',

-- Auditoría
status general_status DEFAULT 'PUBLISHED',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLA: SPORTS
CREATE TABLE IF NOT EXISTS sports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    img_url TEXT,

-- Auditoría
status general_status DEFAULT 'PUBLISHED',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLA: CLUBS
CREATE TABLE IF NOT EXISTS clubs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    img_url TEXT,
    sport_id UUID NOT NULL REFERENCES sports(id) ON DELETE RESTRICT, -- Deporte principal
    admin_user_id UUID NOT NULL REFERENCES users(id),

-- Auditoría
status general_status DEFAULT 'PUBLISHED',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLA: COURTS (Pistas)

CREATE TABLE IF NOT EXISTS courts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE, -- CORREGIDO: Una pista debe pertenecer a un club
    name VARCHAR(100) NOT NULL,
    location_details TEXT,
    img_url TEXT,
    price_h DECIMAL(10, 2) NOT NULL DEFAULT 0,
    
    capacity INTEGER NOT NULL DEFAULT 4 CHECK (capacity > 0),
    is_indoor BOOLEAN NOT NULL DEFAULT FALSE,
    surface VARCHAR(50) NOT NULL DEFAULT 'HARD' CHECK (surface IN ('HARD','CLAY','GRASS','SYNTHETIC','WOOD','OTHER')),

-- Auditoría
status general_status DEFAULT 'PUBLISHED',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLA PIVOTE: COURT_SPORTS (Una pista puede servir para Tenis y Padel a la vez)
CREATE TABLE IF NOT EXISTS court_sports (
    court_id UUID NOT NULL REFERENCES courts (id) ON DELETE CASCADE,
    sport_id UUID NOT NULL REFERENCES sports (id) ON DELETE CASCADE,
    status general_status DEFAULT 'PUBLISHED',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (court_id, sport_id)
);

-- TABLA: CLUB_MEMBERSHIPS
CREATE TABLE IF NOT EXISTS club_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    club_id UUID NOT NULL REFERENCES clubs (id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    joined_date DATE DEFAULT CURRENT_DATE,
    status general_status DEFAULT 'PUBLISHED',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (club_id, user_id)
);

-- TABLA: TRAININGS (La sesión creada por el Coach)
CREATE TABLE IF NOT EXISTS trainings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    club_id UUID REFERENCES clubs (id) ON DELETE CASCADE,
    court_id UUID NOT NULL REFERENCES courts (id),
    instructor_id UUID NOT NULL REFERENCES users (id),
    title VARCHAR(150),
    description TEXT,
    capacity INTEGER DEFAULT 1, -- Si es > 1, es una clase grupal
    price DECIMAL(10, 2) DEFAULT 0,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    series_id UUID,
    status general_status DEFAULT 'PUBLISHED',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT check_dates CHECK (end_time > start_time),
    -- Exclusión interna (evita 2 entrenamientos misma hora misma pista)
    EXCLUDE USING GIST (
        court_id
        WITH
            =,
            tstzrange (start_time, end_time)
        WITH
            &&
    )
    WHERE (
            is_active = TRUE
            AND status = 'PUBLISHED'
        )
);

-- TABLA: TRAINING_PARTICIPANTS (NUEVA: Permite múltiples alumnos por entrenamiento)
CREATE TABLE IF NOT EXISTS training_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    training_id UUID NOT NULL REFERENCES trainings (id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    status payment_status DEFAULT 'PENDING', -- Estado del pago de la clase
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (training_id, user_id) -- Un usuario no se inscribe 2 veces a la misma clase
);

-- TABLA: BOOKINGS (Reservas de pistas por usuarios)
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    user_id UUID NOT NULL REFERENCES users (id),
    court_id UUID NOT NULL REFERENCES courts (id),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    booking_ref VARCHAR(20) UNIQUE,
    price DECIMAL(10, 2),
    notes TEXT,
    status booking_status DEFAULT 'CONFIRMED',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT check_dates CHECK (end_time > start_time),
    -- Exclusión interna (evita 2 reservas misma hora misma pista)
    EXCLUDE USING GIST (
        court_id
        WITH
            =,
            tstzrange (start_time, end_time)
        WITH
            &&
    )
    WHERE (
            status = 'CONFIRMED'
            AND is_active = TRUE
        )
);

-- TABLA: COMPETITIONS
CREATE TABLE IF NOT EXISTS competitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    sport_id UUID NOT NULL REFERENCES sports (id),
    created_by UUID NOT NULL REFERENCES users (id),
    start_date DATE NOT NULL,
    end_date DATE,
    status general_status DEFAULT 'DRAFT',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLA: ORDERS (Financiero)
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    user_id UUID NOT NULL REFERENCES users (id),
    total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
    currency VARCHAR(3) DEFAULT 'USD',
    description TEXT,
    status payment_status DEFAULT 'PENDING',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLA: PAYMENTS
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    order_id UUID NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    payment_method VARCHAR(50),
    transaction_external_id VARCHAR(255),
    status payment_status DEFAULT 'COMPLETED',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================================================
-- 5. ACTIVACIÓN DE TRIGGERS (Omitidos en el script original)
-- ==================================================================================

-- 5.1 Activar actualización de fecha (updated_at)
CREATE TRIGGER update_users_modtime BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sports_modtime BEFORE UPDATE ON sports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clubs_modtime BEFORE UPDATE ON clubs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courts_modtime BEFORE UPDATE ON courts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_court_sports_modtime BEFORE UPDATE ON court_sports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_memberships_modtime BEFORE UPDATE ON club_memberships FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trainings_modtime BEFORE UPDATE ON trainings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_modtime BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_competitions_modtime BEFORE UPDATE ON competitions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_modtime BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_modtime BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5.2 Activar protección de solapamiento cruzado (Bookings vs Trainings)
CREATE TRIGGER check_booking_overlap BEFORE INSERT OR UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION check_court_availability();

CREATE TRIGGER check_training_overlap BEFORE INSERT OR UPDATE ON trainings FOR EACH ROW EXECUTE FUNCTION check_court_availability();

-- ==================================================================================
-- 6. ÍNDICES DE RENDIMIENTO
-- ==================================================================================

CREATE INDEX idx_users_email ON users (email);

CREATE INDEX idx_users_role ON users (role);

CREATE INDEX idx_clubs_sport ON clubs (sport_id);

CREATE INDEX idx_clubs_admin ON clubs (admin_user_id);

CREATE INDEX idx_courts_club ON courts (club_id);
-- Index nuevo importante

CREATE INDEX idx_memberships_user ON club_memberships (user_id);

CREATE INDEX idx_memberships_club ON club_memberships (club_id);

CREATE INDEX idx_trainings_club ON trainings (club_id);

CREATE INDEX idx_trainings_court ON trainings (court_id);

CREATE INDEX idx_trainings_instructor ON trainings (instructor_id);

CREATE INDEX idx_trainings_dates ON trainings (start_time, end_time);

CREATE INDEX idx_training_participants_training ON training_participants (training_id);

CREATE INDEX idx_training_participants_user ON training_participants (user_id);

CREATE INDEX idx_bookings_user ON bookings (user_id);

CREATE INDEX idx_bookings_court ON bookings (court_id);

CREATE INDEX idx_bookings_dates ON bookings (start_time, end_time);

CREATE INDEX idx_orders_user ON orders (user_id);

CREATE INDEX idx_payments_order ON payments (order_id);