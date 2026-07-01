# StreakStudy frontend — convenciones del repo

Este archivo describe las decisiones de arquitectura que **no son obvias del código** para que cualquier desarrollador (humano o asistente IA) las respete sin tener que re-derivarlas.

## Estructura

```
src/
├── assets/        # imágenes, svg, fuentes
├── config/        # constantes, roles/permisos, feature flags, rutas
├── features/      # dominios verticales: <feature>/{components,hooks,schemas,utils}
├── hooks/         # hooks cross-feature (usados por >1 dominio)
├── layouts/       # shells de ruta (AppLayout, PublicLayout)
├── lib/           # utilidades puras y configuración de librerías (axios, query client, utils)
├── pages/         # entrypoints de ruta — agnósticos, composición de features
├── providers/     # providers globales (Query, Theme, Toast, SessionInit)
├── router/        # createBrowserRouter + code-splitting por ruta
├── services/      # capa HTTP — un archivo por dominio del backend
├── shared/        # UI reutilizable: components/{ui,layout,feedback,guards,...}, landing/
├── store/         # Zustand stores globales (auth, session, ui)
├── test/          # setup de Vitest
└── types/         # tipos por dominio del API (alineados con el backend)
```

**Regla**: un hook que toca un solo dominio vive en `features/<dominio>/hooks/`. Cuando dos o más dominios lo usan, sube a `src/hooks/`.

## Estado

- **React Query** es la fuente de verdad para datos del servidor.
- **Zustand** se usa para:
  - Estado de sesión (`auth.store`) — persistido parcialmente en `localStorage`.
  - Estado efímero de UI (`ui.store` — sidebar, modales globales).
  - Status del bootstrap de sesión (`session.store`).
- **Mirror Query → Store**: progress (xp/streak/badges) se espeja al store en cada query fresh (`useProgress`). Lectura síncrona desde el store, loading/error desde el query. No leer del query y del store mezclando dentro del mismo componente.

## Auth

- `accessToken` solo en memoria (nunca persistido).
- `refreshToken` persistido en `localStorage` — tradeoff consciente para un SPA académico. Para producción real conviene cookie HttpOnly + endpoint de refresh por cookie.
- `SessionInitProvider` hidrata sesión al montar la app (por encima del router) — `AuthGuard` y `GuestGuard` solo observan, nunca disparan init.
- `lib/axios.ts` + `services/api.client.ts`: interceptor con mutex `isRefreshing` y cola de pendientes para evitar refresh paralelos en condiciones de carrera.

## RBAC

- Tipos y matriz declarativa en `config/roles.ts`. `hasPermission(role, permission)`.
- `<RoleGuard permission="..." />` para gating de rutas o secciones. Pasar `fallback={null}` para ocultar (UI no ve la sección); omitir `fallback` para redirigir a `/403`.

## Formularios

- React Hook Form + Zod resolver. Schemas viven en `features/<dominio>/schemas/`.
- Errores del servidor → `handleAuthError` (auth) o mapping equivalente con `setError(field, ...)` para campo, fallback a `toast.error`.

## Tailwind

- Tailwind v4 con tokens en `@theme` (ver `src/index.css`).
- Usar tokens semánticos (`bg-surface-base`, `text-text-secondary`, `text-brand-purple`) en lugar de hex literal (`bg-[#0f0f14]`). Si renombras la paleta, los tokens te cubren.

## Testing

- Vitest + Testing Library + jsdom. Setup en `src/test/setup.ts`.
- Tests viven al lado del archivo bajo prueba: `Foo.tsx` + `Foo.test.tsx` / `useFoo.ts` + `useFoo.test.ts`.

## Contrato de API (SPEC-002)

El spec vive en `contracts/openapi.json` (copiado de `proyecto-1-streakstudy/docs/openapi.json`).
Los tipos generados viven en `src/types/api.generated.ts` — **no editar a mano**.

**Cuando el backend cambia el contrato:**
1. Copiar el nuevo `docs/openapi.json` del backend a `contracts/openapi.json`.
2. Ejecutar `npm run generate:api` para regenerar `api.generated.ts`.
3. Si algún type file importa del generado y ahora falla, arreglarlo.
4. Commit de `contracts/openapi.json` + `api.generated.ts` juntos.

**CI** (`.github/workflows/contract-check.yml`) verifica en cada PR que:
- `api.generated.ts` está en sincronía con `contracts/openapi.json`.
- El typecheck del código fuente pasa contra los tipos del spec.

## Comandos

| Comando               | Para qué                                         |
| --------------------- | ------------------------------------------------ |
| `npm run dev`         | Servidor de desarrollo                           |
| `npm run build`       | Typecheck + build de producción                  |
| `npm run typecheck`   | Solo typecheck (sin emitir, para CI)             |
| `npm run generate:api`| Regenerar tipos desde `contracts/openapi.json`   |
| `npm run lint`        | ESLint                                           |
| `npm test`            | Tests en CI (run-once)                           |
| `npm run test:watch`  | Tests en watch                                   |

## Convenciones de commit

`<tipo>(<scope>): <mensaje>` — `feat`, `fix`, `refactor`, `chore`, `test`, `docs`. Cuerpo opcional con bullets explicando el **por qué**.
