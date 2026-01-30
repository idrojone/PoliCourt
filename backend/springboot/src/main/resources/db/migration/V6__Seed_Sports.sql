-- Seed de Deportes

INSERT INTO sports (slug, name, description, img_url, status, is_active)
VALUES 
('tennis', 'Tenis', 'Deporte de raqueta disputado en una pista rectangular.', '/src/assets/tennis.jpg', 'PUBLISHED', true),
('padel', 'Pádel', 'Deporte de paleta disputado en una pista cerrada.', '/src/assets/padel.jpg', 'PUBLISHED', true),
('basketball', 'Baloncesto', 'Deporte de equipo jugado en pista cubierta.', '/src/assets/basketball.jpg', 'PUBLISHED', true),
('soccer', 'Fútbol', 'Deporte de equipo jugado en campo de césped.', '/src/assets/soccer.jpg', 'PUBLISHED', true);