# PoliCourt

Plataforma de gestion deportiva orientada a clubes, canchas, reservas y pagos, implementada con arquitectura de microservicios.

## Estado del proyecto

En desarrollo activo.

## Que resuelve

PoliCourt centraliza la operacion de un ecosistema deportivo:

- Gestion de deportes, clubes, canchas y usuarios.
- Flujo de reservas con reglas de negocio en backend.
- Integracion de pagos con Stripe para checkout y webhooks.
- Exposicion de APIs desacopladas para evolucion por dominio.

## Arquitectura

El repositorio esta organizado como monorepo con tres piezas principales:

- Backend principal: Java 21 + Spring Boot 3.x (`backend/policourt-backend`)
- Backend complementario: FastAPI (`backend/fastapi`)
- Frontend: React + TypeScript + Vite + Bun (`frontend`)

### Vista de alto nivel

```text
Frontend React (4000)
	|- API Spring Boot (4001) -> PostgreSQL
	|- API FastAPI (4003)     -> PostgreSQL
	\- Stripe (checkout)

Stripe CLI (docker) -> webhook -> Spring Boot /api/payments/webhook/stripe
```

### Principios de diseño

- Dominio y negocio en capas limpias del servicio Spring Boot.
- Separacion de responsabilidades entre capa de presentacion, aplicacion, dominio e infraestructura.
- Persistencia en PostgreSQL con migraciones gestionadas por Flyway.

## Tecnologias

### Backend Spring Boot

- Java 21
- Spring Boot 3.5.x
- Spring Security + JWT
- Spring Data JPA
- Flyway
- PostgreSQL
- OpenAPI/Swagger (springdoc)
- Stripe Java SDK

### Backend FastAPI

- Python + FastAPI
- SQLAlchemy
- Pydantic Settings
- JWT middleware

### Frontend

- React 19 + TypeScript
- Vite 7
- Bun
- Tailwind CSS 4
- TanStack Query
- Axios

## Estructura del repositorio

```text
PoliCourt/
|- backend/
|  |- policourt-backend/   # Servicio principal Java/Spring Boot
|  \- fastapi/             # Servicio Python/FastAPI
|- frontend/               # Aplicacion web React
|- scripts/                # Scripts utilitarios (Stripe, etc.)
|- docker-compose.yml      # Orquestacion local
\- .env.example            # Variables de entorno base
```

## Prerrequisitos

- Docker Desktop + Docker Compose
- Java 21 (si vas a correr Spring Boot fuera de Docker)
- Bun 1.x (si vas a correr frontend fuera de Docker)
- Python 3.10+ (si vas a correr FastAPI fuera de Docker)

## Configuracion de entorno

1. Crear archivo de entorno raiz:

```bash
cp .env.example .env
```

En Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

2. Definir secretos obligatorios para backend Java (no commitear secretos reales):

- `JWT_SECRET`
- `JWT_ACCESS_TOKEN_EXPIRATION_MS`
- `JWT_REFRESH_TOKEN_EXPIRATION_MS`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

3. Verificar puertos locales disponibles:

- `4000` Frontend
- `4001` Spring Boot
- `4003` FastAPI
- `5433` PostgreSQL expuesto localmente

## Ejecucion con Docker (recomendado)

Levanta toda la plataforma:

```bash
docker-compose up --build
```

En segundo plano:

```bash
docker-compose up -d --build
```

Servicios incluidos por `docker-compose.yml`:

- `db` (PostgreSQL)
- `springboot`
- `fastapi`
- `frontend`
- `stripe` (Stripe CLI para webhook forwarding)

## Ejecucion por servicio (modo desarrollo)

### 1) Base de datos

```bash
docker-compose up -d db
```

### 2) Spring Boot

Desde `backend/policourt-backend`:

```bash
./mvnw spring-boot:run
```

En Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

### 3) FastAPI

Desde `backend/fastapi`:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 4003 --reload
```

### 4) Frontend

Desde `frontend`:

```bash
bun install
bun dev
```

## Endpoints y documentacion

### Frontend

- http://localhost:4000

### Spring Boot

- API base: http://localhost:4001/api
- Swagger UI: http://localhost:4001/swagger-ui.html
- OpenAPI JSON: http://localhost:4001/api-docs

Dominios detectados en controladores:

- `/api/auth`
- `/api/users`
- `/api/sports`
- `/api/clubs`
- `/api/courts`
- `/api/bookings`
- `/api/payments`

### FastAPI

- API base: http://localhost:4003/api/v1
- OpenAPI JSON: http://localhost:4003/openapi.json
- Swagger UI: http://localhost:4003/docs

## Colecciones Postman

En `backend/policourt-backend`:

- `PoliCourt.postman_collection.json`
- `PoliCourt.Reservas.Payment.postman_collection.json`

## Calidad y verificacion

### Backend Java

Desde `backend/policourt-backend`:

```bash
./mvnw clean install
```

En Windows:

```powershell
.\mvnw.cmd clean install
```

### Frontend

Desde `frontend`:

```bash
bun run lint
bun run build
```

## Problemas comunes

- Error de conexion a DB: validar que `db` este arriba y que Spring use `localhost:5433` en entorno local.
- Error JWT al iniciar Spring: faltan variables `JWT_*` requeridas.
- Webhook de Stripe no llega: revisar que el contenedor `stripe` este corriendo y que el endpoint `/api/payments/webhook/stripe` sea accesible en `4001`.
- CORS desde frontend: validar origen `http://localhost:4000`.

