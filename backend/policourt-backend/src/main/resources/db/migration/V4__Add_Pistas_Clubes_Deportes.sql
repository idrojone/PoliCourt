-- Migration: Seed additional sports, clubs and courts using existing schema

DO $$
BEGIN
  -- add two sports if not present
  INSERT INTO sports(slug,name,description,status,is_active)
  SELECT 'squash','Squash','Deporte de raqueta en recinto cerrado.','PUBLISHED'::general_status,true
  WHERE NOT EXISTS (SELECT 1 FROM sports WHERE slug='squash');

  INSERT INTO sports(slug,name,description,status,is_active)
  SELECT 'badminton','Bádminton','Deporte de raqueta jugado en pista cubierta.','PUBLISHED'::general_status,true
  WHERE NOT EXISTS (SELECT 1 FROM sports WHERE slug='badminton');

  -- insert ten more clubs tied to various sports
  INSERT INTO clubs(slug,name,description,img_url,sport_id,status,is_active)
  SELECT 'club-squash-central','Club Squash Central','Club especializado en squash.','https://example.com/club-squash.jpg', id,'PUBLISHED'::general_status,true
  FROM sports WHERE slug='squash'
  UNION ALL
  SELECT 'badminton-park','Badminton Park','Instalaciones para bádminton.','https://example.com/badminton.jpg', id,'PUBLISHED'::general_status,true
  FROM sports WHERE slug='badminton'
  UNION ALL
  SELECT 'club-tennis-east','Club Tennis East','Club de tenis al este.','https://example.com/tennis-east.jpg', id,'PUBLISHED'::general_status,true
  FROM sports WHERE slug='tennis'
  UNION ALL
  SELECT 'padel-south','Padel South','Pistas de pádel al sur.','https://example.com/padel-south.jpg', id,'PUBLISHED'::general_status,true
  FROM sports WHERE slug='padel'
  UNION ALL
  SELECT 'basketball-academy','Basketball Academy','Academia de baloncesto.','https://example.com/basket.jpg', id,'PUBLISHED'::general_status,true
  FROM sports WHERE slug='basketball'
  UNION ALL
  SELECT 'soccer-north','Soccer North','Campo de fútbol al norte.','https://example.com/soccer.jpg', id,'PUBLISHED'::general_status,true
  FROM sports WHERE slug='soccer'
  UNION ALL
  SELECT 'club-fitness','Club Fitness','Club polideportivo con múltiples deportes.','https://example.com/fitness.jpg', id,'PUBLISHED'::general_status,true
  FROM sports WHERE slug='squash'
  UNION ALL
  SELECT 'club-premium','Club Premium','Instalaciones premium para tenis y padel.','https://example.com/premium.jpg', id,'PUBLISHED'::general_status,true
  FROM sports WHERE slug='tennis'
  UNION ALL
  SELECT 'padel-club-urban','Pádel Club Urban','Pistas urbanas de pádel.','https://example.com/urban.jpg', id,'PUBLISHED'::general_status,true
  FROM sports WHERE slug='padel'
  UNION ALL
  SELECT 'tennis-country','Tennis Country','Club de tenis en las afueras.','https://example.com/country.jpg', id,'PUBLISHED'::general_status,true
  FROM sports WHERE slug='tennis';

  -- insert 20 courts and assign surfaces
  INSERT INTO courts(slug,name,price_h,capacity,is_indoor,surface)
  SELECT 'auto-court-'||s,'Pista '||s,15.00+(s::numeric),4,(s%2=0),
         (CASE WHEN s%3=0 THEN 'GRASS' WHEN s%3=1 THEN 'CLAY' ELSE 'HARD' END)::court_surface_enum
  FROM generate_series(1,20) AS s;

  -- link newly created courts to a sport (round-robin among available sports)
  INSERT INTO court_sports(court_id, sport_id)
  WITH numbered_courts AS (
      SELECT id, ROW_NUMBER() OVER (ORDER BY id) AS rn
      FROM courts
      WHERE slug LIKE 'auto-court-%'
        AND id NOT IN (SELECT court_id FROM court_sports)
  ),
  numbered_sports AS (
      SELECT id, ROW_NUMBER() OVER (ORDER BY id) AS rn
      FROM sports
  ),
  sport_count AS (
      SELECT COUNT(*) AS total FROM sports
  )
  SELECT nc.id, ns.id
  FROM numbered_courts nc
  JOIN numbered_sports ns ON ns.rn = ((nc.rn - 1) % (SELECT total FROM sport_count)) + 1;
END $$;

