---
name: spring-clean-architecture
description: Utiliza esta skill cada vez que vayas a crear o modificar una nueva entidad, caso de uso o endpoint en el proyecto PoliCourt. Define las reglas de nuestra arquitectura limpia.
---

# Arquitectura del Proyecto PoliCourt

Este proyecto utiliza Spring Boot y sigue un enfoque de Arquitectura Limpia y Domain-Driven Design (DDD).

## Reglas Estrictas de Capas:

1. **Domain (`domain/`)**:
   - Aquí residen los modelos de negocio puros (ej. `Court.java`).
   - Cero dependencias de frameworks (no uses anotaciones de Spring, JPA, o Jackson aquí).
   - Aquí van las interfaces de los repositorios (ej. `CourtRepository.java`) y las excepciones de dominio.

2. **Application (`application/`)**:
   - Casos de uso y orquestación. Contiene los "Services" (ej. `CourtService.java`).
   - Llama a las interfaces del dominio, nunca a las implementaciones de infraestructura.

3. **Infrastructure (`infrastructure/`)**:
   - Adaptadores de salida.
   - Aquí van las entidades de base de datos de JPA (`CourtEntity.java` con anotaciones `@Entity`, `@Table`).
   - Implementaciones de los repositorios del dominio (ej. `CourtRepositoryAdapter.java` que llama a `CourtJpaRepository.java`).
   - Mappers para convertir entre `Entity` y modelos de `Domain`.

4. **Presentation (`presentation/`)**:
   - Adaptadores de entrada (API REST).
   - Controladores (`CourtController.java`).
   - DTOs de Request y Response (`CourtCreateRequest.java`, `CourtResponse.java`).
   - Mappers para convertir DTOs a modelos de Dominio.

**Instrucción Final:** Nunca mezcles DTOs en la capa de dominio ni pongas anotaciones de base de datos en los modelos de dominio. Utiliza constructores tipo Builder (Lombok `@Builder`) para la creación de objetos.