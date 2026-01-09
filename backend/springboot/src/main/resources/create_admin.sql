-- Script para crear usuario administrador
-- Ejecutar este script en PostgreSQL después de que las tablas estén creadas

-- Nota: El hash BCrypt de la contraseña "1234admin1234" es: $2a$10$0x.cIij9C5TfIucG2ToFGunhK8KEK/cge8uVunch35Bk5tWaltZhS
-- Este script debe ejecutarse manualmente o a través de una migración

INSERT INTO users (
    id,
    email,
    username,
    password_hash,
    full_name,
    role,
    status,
    is_active,
    profile,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    'admin@admin.com',
    'admin',
    -- Hash BCrypt de "1234admin1234" (strength 10)
    '$2a$10$0x.cIij9C5TfIucG2ToFGunhK8KEK/cge8uVunch35Bk5tWaltZhS',
    'Administrador del Sistema',
    'ADMIN',
    'ACTIVE',
    true,
    '{}'::jsonb,
    NOW(),
    NOW()
)
ON CONFLICT (email) DO NOTHING;
