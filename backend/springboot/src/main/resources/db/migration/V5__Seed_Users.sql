-- Seed de Usuarios con roles variados
-- La contraseña es '12341234' hasheada con BCrypt usando pgcrypto

-- 1. Administrador del Sistema
INSERT INTO users (email, username, password_hash, first_name, last_name, role, status, is_active)
VALUES ('admin@admin.com', 'admin', crypt('12341234', gen_salt('bf')), 'Admin', 'System', 'ADMIN', 'PUBLISHED', true);

-- 2. Administrador de Club
INSERT INTO users (email, username, password_hash, first_name, last_name, role, status, is_active)
VALUES ('clubadmin@policourt.com', 'clubadmin', crypt('12341234', gen_salt('bf')), 'Carlos', 'Dueño', 'CLUB_ADMIN', 'PUBLISHED', true);

-- 3. Staff (Coach y Monitor)
INSERT INTO users (email, username, password_hash, first_name, last_name, role, status, is_active)
VALUES 
('coach@policourt.com', 'coach', crypt('12341234', gen_salt('bf')), 'Marcelo', 'Entrenador', 'COACH', 'PUBLISHED', true),
('monitor@policourt.com', 'monitor', crypt('12341234', gen_salt('bf')), 'Juan', 'Monitor', 'MONITOR', 'PUBLISHED', true);

-- 4. Jugador (User)
INSERT INTO users (email, username, password_hash, first_name, last_name, role, status, is_active)
VALUES ('player@policourt.com', 'player', crypt('12341234', gen_salt('bf')), 'Lionel', 'Jugador', 'USER', 'PUBLISHED', true);
