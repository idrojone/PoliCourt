-- ============================================================================
-- V14: SEED PAYMENT ANALYTICS DATA (Enero 2026 - Abril 2026)
-- ============================================================================
-- Genera datos realistas de bookings, orders, order_items y payments
-- para rellenar las estadísticas del dashboard.
-- ============================================================================

DO $$
DECLARE
    v_user_id BIGINT;
    v_admin_id BIGINT;
    v_court_id BIGINT;
    v_sport_id BIGINT;
    v_booking_id BIGINT;
    v_order_id BIGINT;
    v_order_item_id BIGINT;
    v_price DECIMAL(10,2);
    v_month INT;
    v_day INT;
    v_hour INT;
    v_start TIMESTAMPTZ;
    v_end TIMESTAMPTZ;
    v_booking_uuid UUID;
    v_payment_status payment_status_enum;
    v_order_status order_status_enum;
    v_booking_status booking_status_enum;
    v_intent_id VARCHAR(255);
    v_counter INT := 0;
    v_courts BIGINT[];
    v_sports BIGINT[];
    v_users BIGINT[];
    v_court_idx INT;
    v_sport_idx INT;
    v_user_idx INT;
    v_rand DOUBLE PRECISION;
BEGIN
    -- Obtener IDs de usuarios existentes
    SELECT ARRAY_AGG(id ORDER BY id) INTO v_users FROM users WHERE is_active = true LIMIT 5;
    v_admin_id := v_users[1];

    -- Obtener IDs de pistas existentes (las primeras 4 originales)
    SELECT ARRAY_AGG(id ORDER BY id) INTO v_courts FROM courts WHERE is_active = true LIMIT 8;

    -- Obtener IDs de deportes existentes
    SELECT ARRAY_AGG(id ORDER BY id) INTO v_sports FROM sports WHERE is_active = true LIMIT 6;

    -- ========================================================================
    -- Generar datos para cada mes: Enero, Febrero, Marzo, Abril 2026
    -- ========================================================================
    FOR v_month IN 1..4 LOOP
        -- Generar entre 15 y 25 reservas por mes (variamos por mes)
        FOR v_day IN 2..28 LOOP
            -- Solo algunos días tienen reservas (simula uso real)
            IF v_day % 2 = 0 OR v_day % 3 = 0 THEN

                -- 1-3 reservas por día activo
                FOR v_hour IN 1..LEAST(3, (v_day % 3) + 1) LOOP
                    v_counter := v_counter + 1;

                    -- Rotar pistas, deportes y usuarios
                    v_court_idx := ((v_counter - 1) % array_length(v_courts, 1)) + 1;
                    v_sport_idx := ((v_counter - 1) % array_length(v_sports, 1)) + 1;
                    v_user_idx  := ((v_counter - 1) % array_length(v_users, 1)) + 1;

                    v_court_id := v_courts[v_court_idx];
                    v_sport_id := v_sports[v_sport_idx];
                    v_user_id  := v_users[v_user_idx];

                    -- Hora de inicio: 9h, 11h, 14h, 16h, 18h (rotar)
                    v_hour := 9 + ((v_counter % 5) * 2);
                    v_start := make_timestamptz(2026, v_month, v_day, v_hour, 0, 0, 'Europe/Madrid');
                    v_end := v_start + INTERVAL '1 hour';

                    -- Precio variable (15-30€)
                    v_price := 15.00 + (v_counter % 16)::DECIMAL;

                    -- UUID único
                    v_booking_uuid := gen_random_uuid();

                    -- Determinar si el pago es exitoso, fallido o reembolsado
                    v_rand := random();
                    IF v_rand < 0.78 THEN
                        -- 78% exitosos
                        v_payment_status := 'SUCCEEDED';
                        v_order_status   := 'SUCCESS';
                        v_booking_status := 'CONFIRMED';
                    ELSIF v_rand < 0.90 THEN
                        -- 12% fallidos
                        v_payment_status := 'FAILED';
                        v_order_status   := 'FAILED';
                        v_booking_status := 'CANCELLED';
                    ELSE
                        -- 10% reembolsados
                        v_payment_status := 'REFUNDED';
                        v_order_status   := 'REFUNDED';
                        v_booking_status := 'CANCELLED';
                    END IF;

                    -- Stripe PaymentIntent ID único
                    v_intent_id := 'pi_seed_' || v_month || '_' || v_day || '_' || v_counter || '_' || md5(random()::text);

                    -- --------------------------------------------------------
                    -- INSERT BOOKING (COMPLETED para que no colisione con GIST)
                    -- --------------------------------------------------------
                    INSERT INTO bookings (
                        uuid, court_id, organizer_id, sport_id,
                        type, title, description,
                        start_time, end_time, total_price,
                        status, is_active, created_at
                    ) VALUES (
                        v_booking_uuid, v_court_id, v_user_id, v_sport_id,
                        'CLASS', 'Reserva Seed #' || v_counter, 'Reserva de prueba para estadísticas',
                        v_start, v_end, v_price,
                        v_booking_status, false, make_timestamptz(2026, v_month, v_day, 8, 0, 0, 'Europe/Madrid')
                    ) RETURNING id INTO v_booking_id;

                    -- --------------------------------------------------------
                    -- INSERT ORDER
                    -- --------------------------------------------------------
                    INSERT INTO orders (
                        user_id, total_amount, currency, status,
                        created_at, updated_at
                    ) VALUES (
                        v_user_id, v_price, 'EUR', v_order_status,
                        make_timestamptz(2026, v_month, v_day, 8, 0, 0, 'Europe/Madrid'),
                        make_timestamptz(2026, v_month, v_day, 8, 0, 0, 'Europe/Madrid')
                    ) RETURNING id INTO v_order_id;

                    -- --------------------------------------------------------
                    -- INSERT ORDER_ITEM
                    -- --------------------------------------------------------
                    INSERT INTO order_items (
                        order_id, item_type, booking_id, price
                    ) VALUES (
                        v_order_id, 'CLASS_ENROLLMENT', v_booking_id, v_price
                    ) RETURNING id INTO v_order_item_id;

                    -- --------------------------------------------------------
                    -- INSERT PAYMENT
                    -- --------------------------------------------------------
                    INSERT INTO payments (
                        order_id, booking_id, amount, currency,
                        provider, status, stripe_payment_intent_id,
                        created_at
                    ) VALUES (
                        v_order_id, v_booking_id, v_price, 'EUR',
                        'STRIPE', v_payment_status, v_intent_id,
                        make_timestamptz(2026, v_month, v_day, 8, 5, 0, 'Europe/Madrid')
                    );

                    -- --------------------------------------------------------
                    -- INSERT TICKET (solo para pagos exitosos)
                    -- --------------------------------------------------------
                    IF v_payment_status = 'SUCCEEDED' THEN
                        INSERT INTO tickets (
                            user_id, order_item_id, code, type, status, created_at
                        ) VALUES (
                            v_user_id, v_order_item_id,
                            'TKT-SEED-' || v_counter || '-' || md5(random()::text),
                            'CLASS_ENROLLMENT', 'ISSUED',
                            make_timestamptz(2026, v_month, v_day, 8, 5, 0, 'Europe/Madrid')
                        );
                    END IF;

                END LOOP; -- hours
            END IF; -- day filter
        END LOOP; -- days
    END LOOP; -- months

    RAISE NOTICE 'Seed completado: % registros de pagos generados (Ene-Abr 2026)', v_counter;
END $$;
