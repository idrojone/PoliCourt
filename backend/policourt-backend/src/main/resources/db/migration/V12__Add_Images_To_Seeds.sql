-- ============================================================================
-- V12: Add real images to seeded courts
-- ============================================================================

-- Update courts with real image paths (matching frontend/src/assets/)
UPDATE courts SET img_url = '/src/assets/tennis-court-indoor-clay-surface-professional.jpg'
WHERE slug = 'pista-tenis-tierra';

UPDATE courts SET img_url = '/src/assets/tennis-player-action-shot-serving-professional.jpg'
WHERE slug = 'pista-tenis-rapida';

UPDATE courts SET img_url = '/src/assets/padel-court-indoor-professional-lighting.jpg'
WHERE slug = 'pista-padel-cristal';

UPDATE courts SET img_url = '/src/assets/basketball-court-indoor-wooden-floor-professional.jpg'
WHERE slug = 'pista-multiusos-indoor';

-- Update sports with better image paths (already have img_url but let's verify)
UPDATE sports SET img_url = '/src/assets/tennis-player-action-shot-serving-professional.jpg'
WHERE slug = 'tennis';

UPDATE sports SET img_url = '/src/assets/padel-players-doubles-match-action-professional.jpg'
WHERE slug = 'padel';

UPDATE sports SET img_url = '/src/assets/basketball-player-dunking-action-shot-professional.jpg'
WHERE slug = 'basketball';

UPDATE sports SET img_url = '/src/assets/indoor-futsal-court-green-turf-professional.jpg'
WHERE slug = 'soccer';

-- ============================================================================
-- 3. Update clubs with real image paths
-- ============================================================================
UPDATE clubs SET img_url = '/src/assets/tennis-court-indoor-clay-surface-professional.jpg'
WHERE slug = 'club-tenis-barcelona';

UPDATE clubs SET img_url = '/src/assets/padel-court-indoor-professional-lighting.jpg'
WHERE slug = 'padel-indoor-center';

UPDATE clubs SET img_url = '/src/assets/basketball-court-indoor-wooden-floor-professional.jpg'
WHERE slug = 'club-baloncesto-municipal';

UPDATE clubs SET img_url = '/src/assets/indoor-futsal-court-green-turf-professional.jpg'
WHERE slug = 'escuela-futbol-norte';

-- ============================================================================
-- 4. Add avatars to seeded users (optional)
-- NOTE: If you want user avatars, add them to frontend/src/assets/ and update here
-- For now, we'll leave avatar_url as NULL for users