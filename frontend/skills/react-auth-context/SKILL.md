---
name: react-auth-context
description: Utiliza esta skill siempre que vayas a modificar o crear lógica de autenticación (login, logout), control de acceso a rutas (guards), o estado global del usuario logueado.
---

# Estrategia Híbrida de Estado: Auth vs Datos

En este proyecto frontend utilizamos una estrategia estricta para separar el estado global de autenticación del estado del servidor.

## 1. El Estado de Autenticación (React Context)
Para el usuario actualmente logueado, **NO utilizamos React Query**. Utilizamos exclusivamente React Context.

- **Única fuente de la verdad:** Todo el estado de autenticación debe residir en `src/features/auth/context/AuthContext.tsx` (o `src/context/AuthContext.tsx`).
- **Datos que maneja:** Debe exponer `user` (datos del usuario logueado), `isAuthenticated` (boolean), y los métodos `login` y `logout`.
- **Sincronización Multi-Pestaña:** El contexto DEBE implementar `BroadcastChannel('auth_channel')` en un `useEffect`. Si una pestaña emite un evento de 'LOGOUT', las demás pestañas deben limpiar su estado local automáticamente sin hacer peticiones extra.
- **Local Storage:** El `accessToken` se guarda en `localStorage` (o memoria), pero el estado reactivo que actualiza la UI viene del Contexto.

## 2. Protección de Rutas (Guards)
Cualquier componente en `src/guards/` (como `AdminOnly.tsx` o `PublicOnly.tsx`) **debe consumir el hook `useAuth()`** expuesto por el `AuthContext`. 
- Está prohibido que un Guard lea el `localStorage` directamente o haga peticiones HTTP por su cuenta para saber si el usuario tiene acceso.

## 3. Estado del Servidor (React Query)
Para **TODO lo demás** que no sea saber "quién soy yo" (ej. listar usuarios, ver detalles de una pista, editar un deporte), se debe utilizar estrictamente **TanStack Query (React Query)** siguiendo la arquitectura de features (`src/features/<dominio>/queries` o `mutations`).
- No introduzcas datos de negocio (como la lista de clubes) dentro del `AuthContext` ni crees nuevos contextos globales para datos.

## 4. Peticiones HTTP y Refresh Tokens
La capa de red (`src/lib/axios.sp.ts`) es la responsable de interceptar las peticiones.
- Si recibe un `401 Unauthorized`, Axios intentará llamar al endpoint `/refresh` (que confía en la cookie HttpOnly del backend).
- Si el refresh falla (ej. sesión revocada o expirada), Axios debe limpiar el token y, de ser posible, emitir el evento o llamar al `logout()` del Contexto para que la UI reaccione y expulse al usuario a `/login`.