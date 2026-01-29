-- V4: Crear tabla para mantenimientos de pistas
-- Los mantenimientos son períodos donde la pista no está disponible

CREATE TYPE maintenance_status_enum AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

CREATE TABLE court_maintenances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    
    court_id UUID NOT NULL REFERENCES courts(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
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

-- Índices para búsquedas comunes
CREATE INDEX idx_court_maintenances_court_id ON court_maintenances(court_id);
CREATE INDEX idx_court_maintenances_dates ON court_maintenances(start_time, end_time);
CREATE INDEX idx_court_maintenances_status ON court_maintenances(status);
