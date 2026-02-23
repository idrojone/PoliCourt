---
name: spring-security-jwt-auth
description: Utiliza esta skill para cualquier cambio, creación o depuración del sistema de autenticación, login, logout o gestión de tokens JWT y Refresh Tokens en el proyecto PoliCourt.
---

# Sistema de Autenticación Avanzado PoliCourt (Spring Boot + JWT)

El sistema de autenticación del proyecto implementa un flujo estricto de seguridad con Access Tokens (corta duración) y Refresh Tokens rotatorios (larga duración) almacenados en base de datos para control multi-dispositivo. 

## 1. Estrategia de Tokens
- **Access Token:** - Duración corta (ej. 15 minutos).
  - Se devuelve en el body de la respuesta JSON al hacer login/refresh.
  - El frontend lo usa en el header: `Authorization: Bearer <token>`.
- **Refresh Token:** - Duración larga (ej. 7 días).
  - Se envía EXCLUSIVAMENTE mediante una cookie `HttpOnly`, `Secure` y `SameSite=Strict`.
  - Cada vez que se usa, **se rota** (se genera uno nuevo y se invalida el anterior).

## 2. Modelo de Datos y Arquitectura Limpia

### Entidad `RefreshSession` (Capa de Infraestructura / Dominio)
Debe existir una tabla (ej. `refresh_sessions`) mapeada a JPA con los siguientes campos:
- `id` (UUID, PK)
- `user_id` (UUID o referencia a la entidad User)
- `device_id` (String - Identificador del dispositivo del cliente)
- `family_id` (UUID - Identifica la cadena de rotación del token actual)
- `current_token_hash` (String - Hash SHA-256 del refresh token actual para no guardar el texto plano)
- `revoked` (Boolean - Si la sesión está revocada por seguridad)
- `session_version` (Integer - Copia de la versión de sesión del usuario en el momento de crearla)

### Usuario (`UserEntity`)
Debe tener un campo `session_version` (Integer, default 0). Si este número se incrementa, TODAS las sesiones activas de ese usuario quedan automáticamente invalidadas (Logout Global).

## 3. Flujos Críticos de Negocio (Capa de Application - AuthService)

### A. Login (`/api/v1/auth/login`)
1. Validar credenciales (email y password mediante Spring Security `AuthenticationManager`).
2. Generar `accessToken`.
3. Generar `refreshToken` (UUID aleatorio o JWT opaco).
4. Guardar en base de datos un nuevo registro `RefreshSession` con el hash del refresh token, un nuevo `family_id`, el `device_id` recibido y el `session_version` actual del usuario.
5. Devolver `accessToken` en body y `refreshToken` en cookie HttpOnly.

### B. Refresh (`/api/v1/auth/refresh`)
1. Leer el `refreshToken` desde la cookie HttpOnly (`@CookieValue`).
2. Buscar la sesión en BD buscando el `familyId` incrustado en el token o cruzando datos.
3. **Validaciones de Seguridad:**
   - Si `family.revoked == true` ➔ Lanza 401.
   - Si `family.session_version != user.session_version` ➔ Lanza 401.
   - Si el hash del token recibido NO coincide con `current_token_hash` ➔ **¡ALERTA DE REUSO!** Marca la familia como `revoked = true` en BD y lanza 401 (Posible robo de token).
4. Si todo es OK:
   - Generar nuevo `accessToken`.
   - Generar nuevo `refreshToken` (Rotación).
   - Actualizar `current_token_hash` en la base de datos para esta `family_id`.

### C. Logout
- **Dispositivo (/logout):** Borra la cookie y marca la fila específica de la BD (por `device_id` o `family_id`) como `revoked = true`.
- **Global (/logout-all):** Incrementa el `session_version` del usuario en la tabla `users`. Esto automáticamente invalida todos los refresh tokens asociados a él.

## 4. Consideraciones Frontend (Contexto para el Agente)
El cliente (React/Angular) maneja *race conditions* con múltiples pestañas usando `BroadcastChannel`. Si generas o modificas controladores en Spring Boot, asegúrate de devolver códigos HTTP claros (ej. `401 Unauthorized` si el refresh falla) para que el frontend pueda interceptarlos y limpiar el `localStorage` o comunicarse entre pestañas adecuadamente.