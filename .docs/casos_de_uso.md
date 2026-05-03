# Casos de Uso - PoliCourt

Este documento describe detalladamente los casos de uso del sistema **PoliCourt**, identificando los actores, los objetivos y las interacciones dentro de la arquitectura de microservicios (Spring Boot y FastAPI).

---

## 1. Actores del Sistema

| Actor | Descripción |
|---|---|
| **Anónimo / Visitante** | Usuario no autenticado que explora la plataforma. |
| **Usuario Autenticado (Cliente)** | Usuario que realiza reservas de pistas o se inscribe en clases. |
| **Monitor** | Entrenador o profesor que imparte clases en el club. |
| **Administrador** | Responsable de la gestión completa de clubes, deportes, pistas y reservas. |
| **Pasarela de Pagos (Stripe Webhook)** | Servicio externo que confirma los pagos de forma asíncrona. |

---

## 2. Diagramas de Casos de Uso (Mermaid)

### 2.1 Gestión de Usuarios y Autenticación

Este módulo maneja el acceso y la seguridad de la plataforma.

```mermaid
graph TD
    Anonimo((Anónimo))
    UsuarioAuth((Usuario Autenticado))

    Anonimo --> UC1[Registrarse en PoliCourt]
    Anonimo --> UC2[Iniciar Sesión]

    UsuarioAuth --> UC3[Ver Perfil /me]
    UsuarioAuth --> UC4[Renovar Access Token]
    UsuarioAuth --> UC5[Cerrar Sesión /logout]
    UsuarioAuth --> UC6[Cerrar Todas las Sesiones /logout-all]
```

---

### 2.2 Gestión Deportiva y Recursos (Clubs, Deportes, Pistas)

Tanto la lectura como la administración de los recursos del club.

```mermaid
graph TD
    Admin((Administrador))
    Anonimo((Anónimo))

    Anonimo --> UC7[Listar Deportes Disponibles]
    Anonimo --> UC8[Buscar Clubes Deportivos]
    Anonimo --> UC9[Visualizar Pistas de un Club]

    Admin --> UC10[Crear / Actualizar Deporte]
    Admin --> UC11[Eliminar Deporte]
    
    Admin --> UC12[Crear / Editar Club]
    Admin --> UC13[Baja Lógica / Restaurar Club]
    Admin --> UC14[Cambiar Estado del Club DRAFT/PUBLISHED]

    Admin --> UC15[Dar de alta Pista]
    Admin --> UC16[Editar / Eliminar Pista]
    Admin --> UC17[Cambiar Estado de Pista]
```

---

### 2.3 Reservas y Pagos de Pistas y Clases

Uno de los módulos más críticos del sistema que involucra la integración con Stripe para confirmar pagos.

```mermaid
graph TD
    UsuarioAuth((Usuario Autenticado))
    Monitor((Monitor))
    Admin((Administrador))
    Stripe((Stripe CLI / Webhook))

    UsuarioAuth --> UC18[Ver Horarios Ocupados de una Pista]
    UsuarioAuth --> UC19[Crear Reserva de Pista Rental - PENDING]
    UsuarioAuth --> UC20[Inscribirse en Clase - PENDING]
    UsuarioAuth --> UC21[Cancelar Reserva Propia con Reembolso]

    Monitor --> UC22[Crear / Actualizar Clase]
    Monitor --> UC23[Eliminar Clase propia]

    Admin --> UC24[Crear / Editar Reserva Rental]
    Admin --> UC25[Crear / Editar Reserva Training]
    Admin --> UC26[Baja Lógica de Reserva]
    Admin --> UC27[Cambiar Estado de Reserva]

    Stripe --> UC28[Confirmar Pago y Emitir Tickets]
```

---

## 3. Detalle de los Casos de Uso Principales

### UC19: Crear Reserva de Pista (Rental) y Pago
- **Actor Principal**: Usuario Autenticado
- **Precondiciones**: Usuario logueado, la pista seleccionada debe estar `PUBLISHED` y el horario libre.
- **Flujo Principal**:
  1. El usuario selecciona pista, fecha y hora.
  2. El sistema valida la disponibilidad.
  3. El sistema crea la reserva con estado `PENDING`.
  4. El sistema crea un `PaymentIntent` en Stripe y devuelve el `clientSecret` al frontend.
  5. El usuario completa el pago en el frontend.
  6. Stripe notifica mediante webhook la confirmación del pago (`payment_intent.succeeded`).
  7. El backend actualiza la reserva a `CONFIRMED` y emite los tickets correspondientes.

### UC20: Inscribirse en Clase
- **Actor Principal**: Usuario Autenticado
- **Precondiciones**: Usuario logueado, la clase debe estar activa y tener plazas disponibles.
- **Flujo Principal**:
  1. El usuario solicita la inscripción a una clase.
  2. El sistema valida plazas libres y crea un intento de inscripción temporal.
  3. El sistema genera el `PaymentIntent` de Stripe.
  4. Tras la confirmación del pago en Stripe, el webhook confirma la inscripción definitiva del usuario.

### UC21: Cancelar Reserva Propia
- **Actor Principal**: Usuario Autenticado
- **Precondiciones**: La reserva debe pertenecer al usuario y estar en estado `CONFIRMED`.
- **Flujo Principal**:
  1. El usuario solicita cancelar su reserva.
  2. El sistema valida la política de cancelación (mínimo 3 horas de antelación).
  3. Si cumple, el sistema realiza el reembolso y cambia el estado de la reserva a `CANCELLED`.

---

## 4. Gestión por Microservicios (Spring Boot vs FastAPI)

La plataforma divide responsabilidades para maximizar la escalabilidad.

### Spring Boot (Servicio Principal)
- Control de seguridad y autenticación (Spring Security + JWT).
- Ciclo de vida completo de Reservas y Pagos.
- Persistencia e integridad referencial de usuarios, clubes y pistas.
- Procesamiento de Webhooks de Stripe.

### FastAPI (Servicio Complementario)
- Operaciones rápidas de consulta y búsqueda avanzada de Deportes, Pistas y Clubes.
- APIs ligeras y de alta velocidad para consumo del frontend.
