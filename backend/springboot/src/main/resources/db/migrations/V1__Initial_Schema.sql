-- Crear los tipos ENUM primero para que puedan ser usados en las tablas.
-- Nota: Si estos tipos ya existen en tu BD, puede que necesites borrarlos manualmente
-- o ajustar el script para que no falle.
CREATE TYPE general_status AS ENUM ('PUBLISHED', 'DRAFT', 'ARCHIVED', 'SUSPENDED');
CREATE TYPE court_surface_enum AS ENUM ('HARD', 'CLAY', 'GRASS', 'SYNTHETIC', 'WOOD', 'OTHER');
CREATE TYPE user_role AS ENUM ('ADMIN', 'USER', 'COACH', 'MONITOR', 'CLUB_ADMIN');

-- Tabla de Deportes
CREATE TABLE IF NOT EXISTS sports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    img_url TEXT,
    status general_status DEFAULT 'PUBLISHED',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de Pistas
CREATE TABLE IF NOT EXISTS courts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL UNIQUE,
    location_details TEXT,
    img_url TEXT,
    price_h DECIMAL(10, 2) NOT NULL DEFAULT 0,
    capacity INTEGER NOT NULL DEFAULT 4,
    is_indoor BOOLEAN NOT NULL DEFAULT FALSE,
    surface court_surface_enum NOT NULL DEFAULT 'HARD',
    status general_status DEFAULT 'PUBLISHED',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de Unión entre Pistas y Deportes
CREATE TABLE IF NOT EXISTS court_sports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    court_id UUID NOT NULL REFERENCES courts(id) ON DELETE CASCADE,
    sport_id UUID NOT NULL REFERENCES sports(id) ON DELETE CASCADE,
    UNIQUE (court_id, sport_id)
);

-- Tabla de Usuarios
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
    status general_status DEFAULT 'PUBLISHED',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
