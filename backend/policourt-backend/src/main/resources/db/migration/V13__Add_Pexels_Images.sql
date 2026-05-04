-- ============================================================================
-- V13: Add premium Pexels images for all remaining sports, clubs, and courts
-- ============================================================================

-- 1. Update sports with high-quality direct Pexels images
UPDATE sports SET img_url = 'https://images.pexels.com/photos/1432039/pexels-photo-1432039.jpeg' WHERE slug = 'tennis';
UPDATE sports SET img_url = 'https://images.pexels.com/photos/6203521/pexels-photo-6203521.jpeg' WHERE slug = 'padel';
UPDATE sports SET img_url = 'https://images.pexels.com/photos/358042/pexels-photo-358042.jpeg' WHERE slug = 'basketball';
UPDATE sports SET img_url = 'https://images.pexels.com/photos/32109086/pexels-photo-32109086.jpeg' WHERE slug = 'soccer';
UPDATE sports SET img_url = 'https://images.pexels.com/photos/6203522/pexels-photo-6203522.jpeg' WHERE slug = 'squash';
UPDATE sports SET img_url = 'https://images.pexels.com/photos/3660204/pexels-photo-3660204.jpeg' WHERE slug = 'badminton';

-- 2. Update clubs with high-quality direct Pexels images
UPDATE clubs SET img_url = 'https://images.pexels.com/photos/1432039/pexels-photo-1432039.jpeg' WHERE slug IN ('club-tenis-barcelona', 'club-tennis-east', 'tennis-country', 'club-premium');
UPDATE clubs SET img_url = 'https://images.pexels.com/photos/6203521/pexels-photo-6203521.jpeg' WHERE slug IN ('padel-indoor-center', 'padel-south', 'padel-club-urban');
UPDATE clubs SET img_url = 'https://images.pexels.com/photos/358042/pexels-photo-358042.jpeg' WHERE slug IN ('club-baloncesto-municipal', 'basketball-academy');
UPDATE clubs SET img_url = 'https://images.pexels.com/photos/32109086/pexels-photo-32109086.jpeg' WHERE slug IN ('escuela-futbol-norte', 'soccer-north');
UPDATE clubs SET img_url = 'https://images.pexels.com/photos/6203522/pexels-photo-6203522.jpeg' WHERE slug IN ('club-squash-central');
UPDATE clubs SET img_url = 'https://images.pexels.com/photos/3660204/pexels-photo-3660204.jpeg' WHERE slug IN ('badminton-park');
UPDATE clubs SET img_url = 'https://images.pexels.com/photos/2261477/pexels-photo-2261477.jpeg' WHERE slug IN ('club-fitness');

-- 3. Update all courts with Pexels images based on the sport they are linked to
UPDATE courts c
SET img_url = (
    SELECT s.img_url 
    FROM sports s 
    JOIN court_sports cs ON cs.sport_id = s.id 
    WHERE cs.court_id = c.id 
    LIMIT 1
)
WHERE c.img_url IS NULL OR c.img_url LIKE 'https://example.com%' OR c.img_url = '';

-- Fallback for any court with no images
UPDATE courts SET img_url = 'https://images.pexels.com/photos/2261477/pexels-photo-2261477.jpeg' WHERE img_url IS NULL OR img_url = '';
