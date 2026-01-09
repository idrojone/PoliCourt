# Esquema de Base de Datos Unificado - PoliCourt

## 1. Módulo: Identidad (Identity & Profiles)

### `users`

Tabla maestra de usuarios (Jugadores, Staff, Administradores).

| Campo           | Tipo           | Restricciones    | Descripción                                       |
| :-------------- | :------------- | :--------------- | :------------------------------------------------ |
| `id`            | `UUID`         | PK               | Identificador Global (v7).                        |
| `email`         | `VARCHAR(255)` | UNIQUE, NOT NULL | Login ID.                                         |
| `password_hash` | `VARCHAR`      | NOT NULL         | BCrypt/Argon2.                                    |
| `full_name`     | `VARCHAR(150)` | NOT NULL         | Nombre completo para display.                     |
| `role`          | `VARCHAR(20)`  | NOT NULL         | Enum: `ADMIN`, `PLAYER`, `STAFF`, `CLUB_ADMIN`.   |
| `status`        | `VARCHAR(20)`  | DEFAULT 'ACTIVE' | Enum: `ACTIVE`, `PENDING_VERIFICATION`, `BANNED`. |
| `club_id`       | `UUID`         | FK -> clubs.id   | Club asociado (nullable, para Staff/Admins).      |
| `created_at`    | `TIMESTAMP`    | DEFAULT NOW()    | Auditoría.                                        |
| `updated_at`    | `TIMESTAMP`    | DEFAULT NOW()    | Auditoría.                                        |

### `profiles_professional`

Extensión de usuario para Monitores y Entrenadores (Staff).

| Campo           | Tipo            | Restricciones      | Descripción                            |
| :-------------- | :-------------- | :----------------- | :------------------------------------- |
| `user_id`       | `UUID`          | PK, FK -> users.id | Relación 1:1.                          |
| `types`         | `VARCHAR[]`     |                    | Array Enum: `['MONITOR', 'COACH']`.    |
| `bio`           | `TEXT`          |                    | Descripción pública y experiencia.     |
| `hourly_rate`   | `DECIMAL(10,2)` | NOT NULL           | Precio base por hora.                  |
| `rating_global` | `DECIMAL(3,2)`  | DEFAULT 0.0        | Promedio de puntuaciones.              |
| `bank_details`  | `JSONB`         | **ENCRYPTED**      | Datos sensibles para payouts.          |
| `attributes`    | `JSONB`         |                    | Flexibilidad: Títulos, Idiomas, etc.   |
| `is_active`     | `BOOLEAN`       | DEFAULT TRUE       | Disponibilidad global del profesional. |

---

## 2. Módulo: Gestión de Instalaciones (Facility Inventory)

### `clubs`

Entidad legal o física que agrupa pistas.

| Campo        | Tipo           | Restricciones     | Descripción                                      |
| :----------- | :------------- | :---------------- | :----------------------------------------------- |
| `id`         | `UUID`         | PK                |                                                  |
| `owner_id`   | `UUID`         | FK -> users.id    | Administrador del club.                          |
| `name`       | `VARCHAR(150)` | NOT NULL          | Nombre comercial.                                |
| `address`    | `VARCHAR(255)` |                   | Dirección física.                                |
| `location`   | `JSONB`        |                   | Latitud/Longitud para mapas.                     |
| `sports`     | `VARCHAR[]`    |                   | Deportes ofrecidos (ej: `['TENNIS', 'PADEL']`).  |
| `status`     | `VARCHAR(20)`  | DEFAULT 'PENDING' | Enum: `PENDING_APPROVAL`, `ACTIVE`, `SUSPENDED`. |
| `created_at` | `TIMESTAMP`    | DEFAULT NOW()     | Auditoría.                                       |

### `courts`

El activo físico que se alquila.

| Campo        | Tipo            | Restricciones       | Descripción                                 |
| :----------- | :-------------- | :------------------ | :------------------------------------------ |
| `id`         | `UUID`          | PK                  |                                             |
| `club_id`    | `UUID`          | FK -> clubs.id      | Pertenencia.                                |
| `name`       | `VARCHAR(50)`   | NOT NULL            | Ej: "Pista Central".                        |
| `sport`      | `VARCHAR(20)`   | NOT NULL            | Enum: `TENNIS`, `PADEL`, etc.               |
| `surface`    | `VARCHAR(20)`   |                     | Enum: `CLAY`, `GRASS`, `ACRYLIC`.           |
| `price_hour` | `DECIMAL(10,2)` | NOT NULL            | Precio base de lista.                       |
| `status`     | `VARCHAR(20)`   | DEFAULT 'AVAILABLE' | Enum: `AVAILABLE`, `MAINTENANCE`, `CLOSED`. |

---

## 3. Módulo: Operaciones y Reservas (Booking)

### `professional_schedules`

Disponibilidad horaria de los monitores.

| Campo          | Tipo      | Restricciones  | Descripción              |
| :------------- | :-------- | :------------- | :----------------------- |
| `id`           | `UUID`    | PK             |                          |
| `pro_id`       | `UUID`    | FK -> users.id | El profesional.          |
| `day_of_week`  | `INTEGER` | 0-6            | 0=Lunes, 6=Domingo.      |
| `start_time`   | `TIME`    | NOT NULL       | Inicio de turno.         |
| `end_time`     | `TIME`    | NOT NULL       | Fin de turno.            |
| `is_available` | `BOOLEAN` | DEFAULT TRUE   | Bloqueo manual de horas. |

### `reservations`

El corazón transaccional. Une Usuario, Pista y Pago.

| Campo         | Tipo            | Restricciones   | Descripción                                       |
| :------------ | :-------------- | :-------------- | :------------------------------------------------ |
| `id`          | `UUID`          | PK              |                                                   |
| `user_id`     | `UUID`          | FK -> users.id  | Cliente.                                          |
| `court_id`    | `UUID`          | FK -> courts.id | Recurso.                                          |
| `pro_id`      | `UUID`          | FK -> users.id  | (Nullable) Si hay clase con monitor.              |
| `order_id`    | `UUID`          | FK -> orders.id | (Nullable) Enlace al pago.                        |
| `date`        | `DATE`          | NOT NULL        | Fecha del evento.                                 |
| `start_time`  | `TIME`          | NOT NULL        | Hora inicio.                                      |
| `end_time`    | `TIME`          | NOT NULL        | Hora fin.                                         |
| `total_price` | `DECIMAL(10,2)` | NOT NULL        | Snapshot del precio al reservar.                  |
| `status`      | `VARCHAR(30)`   |                 | Enum: `PENDING_PAYMENT`, `CONFIRMED`, `CANCELED`. |

---

## 4. Módulo: Facturación (Billing)

### `orders`

La intención de compra (Carrito).

| Campo          | Tipo            | Restricciones  | Descripción                                |
| :------------- | :-------------- | :------------- | :----------------------------------------- |
| `id`           | `UUID`          | PK             |                                            |
| `user_id`      | `UUID`          | FK -> users.id | Comprador.                                 |
| `description`  | `VARCHAR(255)`  |                | Resumen (ej: "Reserva Pista 1 + Monitor"). |
| `total_amount` | `DECIMAL(10,2)` | NOT NULL       | Total a cobrar.                            |
| `currency`     | `VARCHAR(3)`    | DEFAULT 'EUR'  | ISO 4217.                                  |
| `status`       | `VARCHAR(20)`   |                | `PENDING`, `PAID`, `CANCELLED`.            |

### `payments`

La ejecución del cobro (Transacción).

| Campo         | Tipo            | Restricciones   | Descripción                                   |
| :------------ | :-------------- | :-------------- | :-------------------------------------------- |
| `id`          | `UUID`          | PK              |                                               |
| `order_id`    | `UUID`          | FK -> orders.id |                                               |
| `stripe_id`   | `VARCHAR(255)`  | UNIQUE          | ID de transacción de Stripe (pi\_...).        |
| `amount`      | `DECIMAL(10,2)` | NOT NULL        | Monto procesado.                              |
| `status`      | `VARCHAR(20)`   |                 | `PENDING`, `COMPLETED`, `FAILED`, `REFUNDED`. |
| `gateway_res` | `JSONB`         |                 | Respuesta raw de Stripe (Log).                |

---

## 5. Módulo: Competiciones (Competitions)

### `competitions`

Torneos, Ligas o Americanas.

| Campo        | Tipo           | Restricciones  | Descripción                         |
| :----------- | :------------- | :------------- | :---------------------------------- |
| `id`         | `UUID`         | PK             |                                     |
| `club_id`    | `UUID`         | FK -> clubs.id | (Nullable) Club organizador.        |
| `title`      | `VARCHAR(150)` | NOT NULL       |                                     |
| `type`       | `VARCHAR(20)`  |                | `LEAGUE`, `TOURNAMENT`, `FRIENDLY`. |
| `start_date` | `TIMESTAMP`    |                | Inicio del evento.                  |
| `end_date`   | `TIMESTAMP`    |                | Fin del evento.                     |
| `min_part`   | `INTEGER`      |                | Mínimo participantes.               |
| `max_part`   | `INTEGER`      |                | Máximo participantes.               |

### `registrations`

Inscripciones a torneos.

| Campo      | Tipo          | Restricciones         | Descripción                       |
| :--------- | :------------ | :-------------------- | :-------------------------------- |
| `id`       | `UUID`        | PK                    |                                   |
| `comp_id`  | `UUID`        | FK -> competitions.id |                                   |
| `user_id`  | `UUID`        | FK -> users.id        | Jugador inscrito.                 |
| `order_id` | `UUID`        | FK -> orders.id       | (Nullable) Pago de inscripción.   |
| `team_id`  | `UUID`        | Nullable              | Si es inscripción por equipos.    |
| `status`   | `VARCHAR(20)` |                       | `REGISTERED`, `PAID`, `WAITLIST`. |

```
src/main/java/com/tuempresa/tuproyecto
│
├── domain                  <-- EL NÚCLEO (Puro Java, sin Spring)
│   ├── model               // Entidades del negocio (POJOs ricos)
│   ├── exception           // Excepciones propias del dominio
│   └── service             // Lógica de negocio pura (opcional, si es compleja)
│
├── application             <-- LA ORQUESTACIÓN (Casos de uso)
│   ├── port                // Interfaces (Contratos)
│   │   ├── in              // Inputs: Lo que la UI puede pedir (Use Cases)
│   │   └── out             // Outputs: Lo que necesitamos de fuera (Repositorios, APIs)
│   ├── service             // Implementación de los casos de uso (port.in)
│   └── dto                 // Objetos para mover datos entre capas
│
├── infrastructure          <-- LOS DETALLES (Spring Boot, BD, Web)
│   ├── adapter
│   │   ├── in              // Driving Adapters (quien maneja la app)
│   │   │   └── web         // Rest Controllers
│   │   └── out             // Driven Adapters (a quien maneja la app)
│   │       ├── persistence // Implementación de Repositorios (JPA/Hibernate)
│   │       │   ├── entity  // Entidades de Base de Datos (con @Entity)
│   │       │   ├── mapper  // Convierte Entity <-> Domain Model
│   │       │   └── repository // Spring Data Interfaces
│   │       └── external    // Clientes API externos (RestClient, Feign)
│   └── config              // Configuración de Beans, Seguridad, Swagger
│
└── TuProyectoApplication.java  <-- Punto de entrada (main class)

---

```
