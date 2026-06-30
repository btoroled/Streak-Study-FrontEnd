#  StreakStudy Frontend

Frontend oficial de **StreakStudy**, una plataforma de aprendizaje gamificada que permite a los estudiantes crear tarjetas de estudio, generar contenido con IA, realizar sesiones de repaso y competir en rankings mediante un sistema de experiencia (XP), rachas y logros.

## Lo Utilizado

* React
* TypeScript
* Vite
* React Router
* Zustand
* React Query
* Axios
* React Hook Form
* Zod
* Tailwind CSS

##  Estructura del Proyecto

```text
src/
├── assets/
├── config/
├── features/
├── hooks/
├── layouts/
├── lib/
├── pages/
├── providers/
├── router/
├── services/
├── shared/
├── store/
├── types/
└── main.tsx
```

##  Requisitos Previos

* Node.js 20+
* npm 10+

##  Instalación

Clonar el repositorio:

```bash
git clone https://github.com/CS2031-DBP/proyecto-2-frontend-streakstudy.git
```

Ingresar al proyecto:

```bash
cd proyecto-2-frontend-streakstudy
```

Instalar dependencias:

```bash
npm install
```

## ▶ Ejecución en Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en:

```text
http://localhost:5173
```

##  Construcción para Producción

```bash
npm run build
```

##  Linter

```bash
npm run lint
```

##  Integración con Backend

Este frontend consume los servicios REST desarrollados en el backend de StreakStudy mediante Spring Boot.

Las configuraciones de conexión se realizan mediante variables de entorno. El cliente HTTP construye la baseURL como `${VITE_API_URL}/api/v1`, por lo que la variable solo debe apuntar al host del backend.

Ejemplo (copiar de `.env.local.example`):

```env
VITE_API_URL=http://localhost:8081
VITE_FEATURE_LEADERBOARD=false
VITE_FEATURE_INSTITUTIONS_LIST=false
VITE_DEFAULT_INSTITUTION_ID=1
VITE_DEFAULT_INSTITUTION_NAME=Universidad Demo
```

##  Scripts

| Comando             | Descripción                                |
| ------------------- | ------------------------------------------ |
| `npm run dev`       | Servidor de desarrollo (Vite, puerto 5173) |
| `npm run build`     | Typecheck + bundle de producción           |
| `npm run typecheck` | Solo `tsc -b` (sin emitir, para CI)        |
| `npm run lint`      | ESLint sobre todo el repo                  |
| `npm test`          | Vitest en modo CI (run-once)               |
| `npm run test:watch`| Vitest en modo watch                       |

##  Funcionalidades

* Autenticación de usuarios
* Gestión de cursos
* Gestión de mazos de estudio
* Gestión de flashcards
* Sesiones de estudio gamificadas
* Sistema de experiencia (XP)
* Sistema de logros
* Ranking de estudiantes
* Perfil de usuario
* Generación de contenido mediante IA
* Gestión de documentos PDF

## Seguridad

### Content Security Policy (CSP)

La aplicación define una CSP en dos lugares:

- **Desarrollo** (`vite.config.ts` `server.headers`): incluye `'unsafe-inline'` en `script-src` y permite WebSockets de HMR (`ws://localhost:*`). Solo aplica al servidor de Vite, no a la build de producción.
- **Producción** (`index.html` meta tag): excluye `'unsafe-inline'` de `script-src`. La build de Vite genera bundles con hash, por lo que no se necesitan scripts inline.

Directivas clave:

| Directiva | Valor | Motivo |
|---|---|---|
| `script-src` | `'self'` | Solo bundles locales; sin eval ni inline |
| `style-src` | `'self' 'unsafe-inline'` | Framer-motion aplica estilos inline para animaciones |
| `connect-src` | `'self' https: http://localhost:*` | API backend (prod via HTTPS, dev via localhost) |
| `object-src` | `'none'` | Bloquea plugins (Flash, etc.) |
| `base-uri` | `'self'` | Previene inyección de base URL |
| `form-action` | `'self'` | Previene exfiltración via form submit |

### Tradeoff: refreshToken en localStorage

El `refreshToken` se persiste en `localStorage` como decisión consciente para este SPA académico.

**Riesgos conocidos:**
- Un ataque XSS exitoso podría leer el token desde `localStorage`.
- Extensiones de navegador maliciosas tienen acceso a `localStorage`.

**Mitigaciones aplicadas:**
- La CSP bloquea scripts externos e inline, reduciendo la superficie de XSS.
- El `accessToken` (de vida corta) vive **solo en memoria** — nunca se persiste.
- Validación de entrada con Zod + React Hook Form en todos los formularios.
- Sin `dangerouslySetInnerHTML` ni `innerHTML` directo en ningún componente.

**Alternativa recomendada para producción real:**
Usar una cookie `HttpOnly; Secure; SameSite=Strict` para el `refreshToken`, con un endpoint `/auth/refresh` que la lea del lado del servidor. Esto hace el token inaccesible desde JavaScript. La implementación actual es un tradeoff aceptable para un proyecto académico donde la simplicidad del despliegue importa.

