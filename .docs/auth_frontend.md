# Módulo de Autenticación - PoliCourt Frontend

## Estructura del Feature `auth`

```
features/auth/
├── api/
│   └── authApi.ts          # Cliente HTTP (Axios) - Endpoints del backend
├── components/
│   ├── LoginForm.tsx       # Formulario de login (Presentacional)
│   └── RegisterForm.tsx    # Formulario de registro (Presentacional)
├── context/
│   └── AuthContext.tsx     # Context API - Estado global de Auth
├── hooks/
│   └── useAuth.ts          # Hook personalizado con React Query mutations
├── types/
│   └── index.ts            # Interfaces TS (User, DTOs, etc)
└── index.ts                # Exports públicos del módulo
```

## Responsabilidades por Carpeta

### `/api`
- **Responsabilidad:** Comunicación con el backend (Spring Boot).
- **Tecnología:** Axios configurado en `lib/axios.ts`.
- **Endpoints:**
  - `POST /api/auth/login` - Iniciar sesión
  - `POST /api/auth/register` - Crear cuenta
  - `POST /api/auth/logout` - Cerrar sesión
  - `POST /api/auth/refresh` - Renovar access token
  - `GET /api/auth/me` - Obtener usuario actual

### `/components`
- **Responsabilidad:** Componentes "tontos" (presentacionales).
- **Regla:** Solo manejan UI y eventos. NO tienen lógica de negocio.
- **Ejemplo:** `LoginForm` recibe props del hook `useAuth` pero no sabe de Axios ni Context.

### `/context`
- **Responsabilidad:** Estado global del usuario autenticado.
- **Implementación:** React Context API nativo.
- **Contenido:** 
  - `user: User | null`
  - `isAuthenticated: boolean`
  - `isLoading: boolean`
  - Métodos: `setUser()`, `logout()`

### `/hooks`
- **Responsabilidad:** Lógica de negocio y orquestación.
- **Tecnología:** React Query (TanStack Query) para mutations.
- **Hook principal:** `useAuth()`
  - Encapsula el contexto
  - Provee mutations (login, register, logout)
  - Maneja navegación y side effects

### `/types`
- **Responsabilidad:** Contratos de TypeScript.
- **Contenido:**
  - Entidades: `User`, `UserRole`, `UserStatus`
  - DTOs: `LoginRequest`, `LoginResponse`, `RegisterRequest`, etc.
  - Estado: `AuthState`

### `index.ts` (Barrel Export)
- **Responsabilidad:** Controlar qué se expone públicamente.
- **Regla:** Otros módulos SOLO importan desde aquí.
- **Ejemplo:** `import { useAuth, LoginForm } from '@/features/auth'`

## Flujo de Datos (Login)

```
1. Usuario llena LoginForm
2. LoginForm llama a `useAuth().login(credentials)`
3. useAuth ejecuta mutation de React Query
4. Mutation llama a `authApi.login(credentials)` (Axios)
5. Backend responde con { accessToken, refreshToken, user }
6. Mutation guarda tokens en localStorage
7. Mutation actualiza AuthContext con `setUser(user)`
8. useAuth navega a `/dashboard`
9. App detecta isAuthenticated = true
```

## Manejo de Tokens

### Access Token
- **Ubicación:** `localStorage.getItem('access_token')`
- **Uso:** Se inyecta automáticamente en todas las peticiones (interceptor de Axios)
- **Expiración:** Cuando el backend responde 401, se intenta refresh

### Refresh Token
- **Ubicación:** `localStorage.getItem('refresh_token')`
- **Uso:** Solo para renovar access token cuando expira
- **Flujo de Refresh:**
  1. Request falla con 401
  2. Interceptor de Axios atrapa el error
  3. Llama a `POST /auth/refresh` con refreshToken
  4. Backend responde con nuevo accessToken
  5. Reintenta request original
  6. Si falla el refresh, logout forzado y redirect a `/login`

## Rutas Protegidas

### Componente `ProtectedRoute`
```tsx
<Route path="/dashboard" element={
  <ProtectedRoute>
    <DashboardPage />
  </ProtectedRoute>
} />
```

**Comportamiento:**
- Si `isLoading = true` → Muestra spinner
- Si `isAuthenticated = false` → `<Navigate to="/login" />`
- Si `isAuthenticated = true` → Renderiza children

## Configuración de Entorno

### `.env`
```bash
VITE_API_URL=http://localhost:8080/api
```

**Uso:** Todas las peticiones de Axios van a `${VITE_API_URL}/auth/**`

## Integraciones Globales

### `main.tsx`
```tsx
<QueryClientProvider>      ← React Query
  <AuthProvider>            ← Context de Auth
    <App />
  </AuthProvider>
</QueryClientProvider>
```

### `App.tsx`
- Define rutas públicas (`/login`, `/register`)
- Define rutas protegidas (wrapeadas con `ProtectedRoute`)

## Próximos Pasos (TODOs)

1. **Backend:** Implementar endpoints de Auth en Spring Boot
2. **Validación:** Agregar librería de validación de forms (React Hook Form + Zod)
3. **Toasts:** Instalar Sonner o React Hot Toast para notificaciones
4. **Testing:** Agregar tests con Vitest + Testing Library
5. **Seguridad:** Implementar CSRF protection si se usan cookies
6. **Refresh Token:** Configurar auto-refresh silencioso antes de expiración

## Comandos Útiles

```bash
# Instalar dependencias
bun install

# Ejecutar en desarrollo
bun dev

# Build de producción
bun run build

# Preview del build
bun run preview
```

---

**Nota para el equipo:** Este módulo sigue Clean Architecture. No rompas la separación de responsabilidades. Si necesitás agregar features, seguí la misma estructura.
