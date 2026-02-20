---
name: tanstack-query-api
description: Úsala cuando necesites conectar el frontend con el backend, hacer peticiones HTTP o manejar el estado asíncrono.
---

# Flujo de Datos y API

Utilizamos **TanStack Query (React Query)** para el estado del servidor y **Axios** para el cliente HTTP. 

## Pasos para crear una nueva interacción con la API:
1. **Tipos:** Define los interfaces de la petición y respuesta en `src/features/types/<dominio>/`.
2. **Service:** Crea la función pura de llamada HTTP en `src/features/<dominio>/service/`. Importa la instancia de axios preconfigurada desde `src/lib/` (fíjate en si debes usar `axios.sp.ts` u otra según corresponda).
3. **Query/Mutation:** Envuelve el service en un custom hook dentro de `src/features/<dominio>/queries/` (si es un GET) o `src/features/<dominio>/mutations/` (si es POST/PUT/DELETE). Usa `useQuery` o `useMutation`.
4. **Invalidación:** Si creas una mutation, asegúrate de utilizar el `queryClient.invalidateQueries` en el bloque `onSuccess` para actualizar la UI automáticamente.

**IMPORTANTE:** Nunca hagas peticiones `axios.get()` o `fetch()` directamente dentro de un componente React.