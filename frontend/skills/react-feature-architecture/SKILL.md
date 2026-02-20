---
name: react-feature-architecture
description: Se activa al crear o modificar cualquier componente, página o lógica de negocio. Define la estructura de carpetas basada en Features del proyecto.
---

# Arquitectura del Frontend (Feature-Based)

Este proyecto React/TypeScript sigue una arquitectura modularizada por dominios (Features). **Nunca** agrupes código de dominio específico en las carpetas globales genéricas.

## Reglas de Estructura:

1. **`src/features/<nombre-dominio>/`**: Toda la lógica relacionada con un dominio (ej. `user`, `club`, `court`, `sport`) DEBE ir aquí.
2. Dentro de cada feature, respeta esta subdivisión estricta:
   - `components/`: Componentes UI específicos de este dominio (ej. `club-card.tsx`).
   - `hooks/`: Custom hooks para lógica de UI de este dominio (ej. `useClubFormLogic.ts`).
   - `mutations/`: Hooks de React Query para modificar datos (`useCreateClubMutation.ts`).
   - `queries/`: Hooks de React Query para obtener datos (`useClubsPageQuery.ts`).
   - `schema/`: Esquemas de validación con Zod (ej. `ClubSchema.ts`).
   - `service/`: Funciones puras que hacen fetch con Axios (ej. `club.sp.service.ts`).
3. **Carpetas Globales (`src/components`, `src/hooks`, `src/lib`)**: Solo deben usarse para código **100% genérico y reutilizable** en múltiples features (ej. utilidades de fechas, botones globales, hooks de paginación genérica).
4. **Páginas (`src/pages/`)**: Las páginas (`public/` o `private/`) solo deben ser contenedores (Wrappers). Deben importar los componentes complejos desde `src/features/`.