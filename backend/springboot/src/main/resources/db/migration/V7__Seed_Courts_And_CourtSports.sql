-- V7: Seed de Pistas y su relación con Deportes

-- Usamos un bloque anónimo para declarar variables y hacer el script más legible y robusto,
-- evitando hardcodear UUIDs.
DO $$
DECLARE
    -- IDs de los deportes que ya existen gracias a V6
    tennis_id UUID;
    padel_id UUID;
    basketball_id UUID;
    soccer_id UUID;
    
    -- IDs de las pistas que vamos a crear
    court_tenis_1_id UUID;
    court_tenis_2_id UUID;
    court_padel_1_id UUID;
    court_multiusos_id UUID;
BEGIN
    -- 1. Obtener los IDs de los deportes existentes por su slug
    SELECT id INTO tennis_id FROM sports WHERE slug = 'tennis';
    SELECT id INTO padel_id FROM sports WHERE slug = 'padel';
    SELECT id INTO basketball_id FROM sports WHERE slug = 'basketball';
    SELECT id INTO soccer_id FROM sports WHERE slug = 'soccer';

    -- 2. Insertar las pistas y guardar sus nuevos IDs en las variables usando RETURNING
    INSERT INTO courts (slug, name, price_h, capacity, is_indoor, surface)
    VALUES ('pista-tenis-tierra', 'Pista de Tenis 1 (Tierra Batida)', 15.50, 4, false, 'CLAY') RETURNING id INTO court_tenis_1_id;

    INSERT INTO courts (slug, name, price_h, capacity, is_indoor, surface)
    VALUES ('pista-tenis-rapida', 'Pista de Tenis 2 (Rápida)', 18.00, 4, true, 'HARD') RETURNING id INTO court_tenis_2_id;

    INSERT INTO courts (slug, name, price_h, capacity, is_indoor, surface)
    VALUES ('pista-padel-cristal', 'Pista de Pádel 1 (Cristal)', 20.00, 4, true, 'SYNTHETIC') RETURNING id INTO court_padel_1_id;

    INSERT INTO courts (slug, name, price_h, capacity, is_indoor, surface, location_details)
    VALUES ('pista-multiusos-indoor', 'Pista Multiusos (Interior)', 25.00, 10, true, 'WOOD', 'Pista apta para baloncesto y fútbol sala.') RETURNING id INTO court_multiusos_id;

    -- 3. Asociar las pistas con los deportes en la tabla de cruce `court_sports`
    INSERT INTO court_sports (court_id, sport_id)
    VALUES
        (court_tenis_1_id, tennis_id),
        (court_tenis_2_id, tennis_id),
        (court_padel_1_id, padel_id),
        (court_multiusos_id, basketball_id),
        (court_multiusos_id, soccer_id); -- La pista multiusos sirve para dos deportes
END $$;