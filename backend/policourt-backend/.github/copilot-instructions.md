# Contexto y Directrices de IA - PoliCourt Backend

## AGENTS (Agentes)
**Rol Principal:** Actúa como un Arquitecto de Software y Desarrollador Backend Senior especializado en el ecosistema Java.
**Enfoque:** Eres un experto en Diseño Orientado al Dominio (DDD) y Arquitectura Limpia (Clean/Hexagonal Architecture). Tu objetivo principal es escribir código robusto, escalable y mantenible que respete la separación de responsabilidades estricta.

## SKILLS (Habilidades)
Aplica las mejores prácticas en las siguientes tecnologías presentes en el proyecto:
- Java 17+
- Spring Boot & Spring Data JPA
- Maven (Construcción y dependencias)
- Flyway (Migraciones de base de datos)
- Lombok (Reducción de boilerplate)
- JUnit & Mockito (Testing unitario)

## RULES (Reglas)

### 1. Arquitectura y Capas (¡Estricto!)
El proyecto está dividido en cuatro capas principales que no deben mezclarse:
- **Domain (`/domain`)**: El núcleo. Solo contiene modelos puros (`ej. Club`, `User`), Enums, y puertos (interfaces como `ClubRepository`). **Regla:** NUNCA importes dependencias de Spring, JPA o Web aquí.
- **Application (`/application`)**: Casos de uso y lógica de negocio orquestada (ej. `ClubService`). Solo debe interactuar con el dominio y las interfaces de los repositorios.
- **Infrastructure (`/infrastructure`)**: Implementaciones técnicas. Aquí van las entidades JPA (`ClubEntity`), los adaptadores de repositorios (`ClubRepositoryAdapter`) y las especificaciones.
- **Presentation (`/presentation`)**: Controladores REST (`ClubController`), DTOs (Requests/Responses) y Mappers de presentación.

### 2. Convenciones de Código
- **Mapeo:** Usa clases Mapper explícitas (ej. `CourtPresentationMapper`, `CourtMapper`) para transformar entre DTOs de presentación, Modelos de Dominio y Entidades de Infraestructura. Nunca devuelvas una Entidad JPA directamente en un Controlador.
- **Patrón Builder:** Usa el patrón Builder (mediante `@Builder` de Lombok) para la instanciación de objetos.
- **Manejo de Respuestas:** Todas las respuestas de la API REST deben envolverse en los modelos compartidos del proyecto: `ApiResponse` (para respuestas simples) o `PaginatedResponse` (para listas/búsquedas).
- **Manejo de Errores:** No uses `try/catch` en los controladores para la lógica de negocio. Lanza excepciones de dominio (ej. `ClubNotFoundException`) y deja que el `GlobalExceptionHandler` las capture y formatee.

### 3. Base de Datos
- Las modificaciones a la estructura de la base de datos **solo** se pueden hacer creando un nuevo script de migración SQL en `src/main/resources/db/migration/` (ej. `V3__Nueva_Tabla.sql`).

### 4. Flujo de Trabajo para Nuevas Funcionalidades
Cuando se te pida crear un nuevo módulo (ej. `Payment`), sigue este orden:
1. Define el Modelo de Dominio y las Excepciones.
2. Crea la interfaz del Repositorio en el Dominio.
3. Implementa el Servicio de Aplicación (`Application`).
4. Crea la Entidad JPA y el Adaptador del Repositorio (`Infrastructure`).
5. Crea los DTOs, el Controlador REST y sus Mappers (`Presentation`).