# Issues — StreakStudy Mobile (RN)

Backlog inicial para `CS2031-DBP/proyecto-2-mobile-streakstudy`. Stack base: **Expo SDK + React Navigation + TypeScript + React Query + Zustand + RHF + Zod**, basado en el frontend web. Un issue por bloque — copiar y pegar en GitHub.

**Labels sugeridas**: `epic:foundation`, `epic:auth`, `epic:feature`, `epic:mobile-native`, `epic:quality`, `priority:p0`, `priority:p1`, `priority:p2`.

**Backend**: comparte el mismo Spring Boot del web (`VITE_API_URL/api/v1` → `EXPO_PUBLIC_API_URL/api/v1`). Mismos contratos.

---

## Épica 1 — Foundation (P0)

### Issue 1.1 — Bootstrap del proyecto Expo + TypeScript

**Labels**: `epic:foundation`, `priority:p0`

**Contexto**: arrancar el repo con el stack acordado.

**Tareas**
- [ ] `npx create-expo-app@latest -t expo-template-blank-typescript`
- [ ] Configurar `app.json` (name, slug, scheme `streakstudy`, version 1.0.0, orientación portrait, splash y íconos del web — reutilizar `app-icon-512.png`, `app-icon-maskable.png`)
- [ ] Instalar deps base: `axios @tanstack/react-query @tanstack/react-query-devtools zustand react-hook-form @hookform/resolvers zod nativewind react-native-mmkv expo-secure-store sonner-native lucide-react-native`
- [ ] Instalar `react-navigation`: `@react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context`
- [ ] Configurar path aliases `@/*` en `tsconfig.json` + `babel.config.js` (`babel-plugin-module-resolver`)
- [ ] Configurar ESLint + Prettier (replicar reglas del web: `eslint-config-universe` de Expo)
- [ ] `.env.example` con `EXPO_PUBLIC_API_URL=http://localhost:8081`

**Criterio de aceptación**
- `npx expo start` levanta la app en simulador iOS y emulador Android.
- `npm run lint` y `tsc --noEmit` pasan limpio.

---

### Issue 1.2 — Estructura de carpetas + CLAUDE.md de convenciones

**Labels**: `epic:foundation`, `priority:p0`

**Contexto**: replicar la arquitectura feature-based del web para que el equipo no improvise estructura.

**Tareas**
- [ ] Crear esqueleto:
  ```
  src/
  ├── assets/        (íconos, imágenes — reutilizar las del web)
  ├── config/        (constants, roles, featureFlags, routes)
  ├── features/      (auth, dashboard, decks, study, documents, courses,
  │                   achievements, store, leaderboard, profile, notifications,
  │                   analytics)
  ├── hooks/         (hooks cross-feature)
  ├── lib/           (axios, query-client, query-keys, utils)
  ├── navigation/    (root navigator, auth/app stacks, tab navigator)
  ├── providers/     (Providers, QueryProvider, SessionInitProvider, ThemeProvider)
  ├── screens/       (entrypoints — equivalente de pages/ web)
  ├── services/      (HTTP por dominio — mismo contrato que web)
  ├── shared/        (components/ui, components/feedback, components/guards,
  │                   components/gamification)
  ├── store/         (auth, session, ui)
  └── types/         (por dominio, alineados con backend)
  ```
- [ ] Crear `CLAUDE.md` con convenciones del repo (basarse en `CLAUDE.md` del web, adaptado para RN: SecureStore en lugar de localStorage, NativeWind en lugar de Tailwind clases, etc.)
- [ ] Crear `README.md` con setup, scripts y notas de plataforma (iOS/Android)

**Criterio de aceptación**
- Estructura visible, CLAUDE.md commiteado.

---

### Issue 1.3 — Cliente HTTP con interceptor de refresh + mutex

**Labels**: `epic:foundation`, `priority:p0`

**Contexto**: portar el patrón del web (`src/services/api.client.ts` + `src/lib/axios.ts`) con la cola de pendientes durante el refresh. El backend retorna `accessToken/refreshToken/xp` en `/auth/refresh`. **El refreshToken debe vivir en SecureStore (no AsyncStorage)**.

**Tareas**
- [ ] Crear `lib/axios.ts` con `axiosInstance.create({ baseURL: ${EXPO_PUBLIC_API_URL}/api/v1 })`
- [ ] Crear `services/api.client.ts` con interceptors equivalentes al web:
  - Request: adjunta `Authorization: Bearer <accessToken>` excepto en `/auth/login|register|refresh`
  - Response: 401 → /auth/refresh con mutex `isRefreshing` y cola `pendingQueue`; en éxito retry, en fallo logout + redirect a login
- [ ] Guard contra `error.config === undefined` (errores de red sin request configurado)
- [ ] Tests con vitest/jest equivalentes a `src/services/api.client.test.ts` del web

**Criterio de aceptación**
- 4 tests del interceptor pasan (happy path retry, cola con un único refresh, skip de /auth/login, no Authorization en /auth/refresh).

**Bloquea**: 1.4, 2.1, 3.x

---

### Issue 1.4 — Auth store con SecureStore para refreshToken

**Labels**: `epic:foundation`, `epic:auth`, `priority:p0`

**Contexto**: el web usa `localStorage` para persistir refreshToken (tradeoff de SPA). En mobile **debe ir a SecureStore** (keychain iOS, EncryptedSharedPreferences Android) — bloqueable por biometría más adelante.

**Tareas**
- [ ] Crear `store/auth.store.ts` con misma shape que el web (accessToken in-memory, refreshToken + userId + role + email + xp + streak + badges persistidos)
- [ ] Custom storage para `zustand/persist` que delegue a `expo-secure-store` (refreshToken) y `react-native-mmkv` (resto, más rápido que AsyncStorage)
- [ ] `store/session.store.ts` y `store/ui.store.ts` idénticos al web
- [ ] Documentar en CLAUDE.md por qué refreshToken vive separado en SecureStore

**Criterio de aceptación**
- `useAuthStore.getState().setAuth(...)` persiste correctamente y sobrevive a kill de la app.

**Depende de**: 1.1

---

### Issue 1.5 — React Query Provider + query keys + error utils

**Labels**: `epic:foundation`, `priority:p0`

**Tareas**
- [ ] `lib/query-client.ts` con `staleTime: 60000`, `retry: 1`, `refetchOnWindowFocus: false`
- [ ] `lib/query-keys.ts` portado del web 1:1
- [ ] `lib/error.utils.ts` portado (extractApiError, getErrorCode, getErrorMessage)
- [ ] `providers/QueryProvider.tsx` (sin devtools, no aplica en RN)
- [ ] Considerar `@tanstack/react-query-persist-client` con AsyncStorage para offline cache de queries críticas (progress, decks, due flashcards)

**Criterio de aceptación**
- App renderiza con QueryProvider; un `useQuery` mock funciona.

---

### Issue 1.6 — Theme + tokens de diseño con NativeWind

**Labels**: `epic:foundation`, `priority:p0`

**Contexto**: el web usa Tailwind v4 con `@theme`. En RN se replica con **NativeWind v4** (los mismos tokens funcionan). Lista de tokens en `src/index.css` del web.

**Tareas**
- [ ] Instalar NativeWind v4 + `tailwindcss@3.4` (NativeWind v4 aún requiere v3 de Tailwind)
- [ ] Crear `tailwind.config.js` con los tokens del web (`color-brand-orange`, `color-surface-base`, etc.)
- [ ] `babel.config.js` con preset de NativeWind
- [ ] Wrapper `Box`, `Text` con clases utility (probar `className="bg-surface-base"`)
- [ ] Definir `colorScheme: 'dark'` por defecto (el diseño del web es dark-first)

**Criterio de aceptación**
- Un componente con `<Text className="text-text-primary">` renderiza con el color correcto.

---

### Issue 1.7 — Navigation: stacks Auth / App + Tab navigator

**Labels**: `epic:foundation`, `priority:p0`

**Contexto**: equivalente al `router/index.tsx` del web pero con React Navigation. Bottom tabs para las pestañas principales, stack para detalles.

**Tareas**
- [ ] `navigation/RootNavigator.tsx`: switch entre `AuthStack` y `AppTabs` según `useSessionStore.status` (igual que el `SessionInitProvider` del web)
- [ ] `navigation/AuthStack.tsx`: Landing, Login, Register, ForgotPassword, ResetPassword
- [ ] `navigation/AppTabs.tsx` (bottom tabs): Dashboard, Study, Decks, Documents, Profile (otras opciones van en menú interno)
- [ ] `navigation/stacks/`: stacks por feature (DecksStack con Decks + DeckDetail, StudyStack con Study + StudySession, etc.)
- [ ] Definir tipos de navegación (`RootStackParamList`, etc.) y exportar
- [ ] Linking config con scheme `streakstudy://` para deep links posteriores

**Criterio de aceptación**
- Login → Tabs visible al estar autenticado.
- Tab inferior con 5 pestañas + íconos lucide.

**Depende de**: 1.4

---

### Issue 1.8 — SessionInitProvider + guards de navegación

**Labels**: `epic:foundation`, `epic:auth`, `priority:p0`

**Tareas**
- [ ] Portar `providers/SessionInitProvider.tsx` del web: si hay refreshToken en SecureStore, dispara `authService.refresh` + `progressService.getProgress`, setea `useSessionStore.status`
- [ ] Trigger adicional **al volver del background** (AppState `active` → re-validar accessToken si > 14 min de inactividad). Importante en mobile.
- [ ] `RoleGuard` adaptado: en RN no hay `<Navigate />`; redirige con `navigation.replace('Forbidden')`

**Criterio de aceptación**
- Kill app → reabrir → entra directo a Dashboard sin pedir credenciales.
- Foreground tras 30 min → refresh transparente.

**Depende de**: 1.3, 1.4, 1.7

---

## Épica 2 — Auth (P0)

### Issue 2.1 — Pantallas de login/register/forgot/reset

**Labels**: `epic:auth`, `priority:p0`

**Contexto**: portar `features/auth/` del web. Mismos schemas Zod, mismo `useAuth` hook, mismo `handleAuthError` mapper. UI con NativeWind.

**Tareas**
- [ ] Schemas Zod copy-paste de `features/auth/schemas/auth.schemas.ts`
- [ ] `features/auth/hooks/useAuth.ts`: login, register, logout (replicar 1:1)
- [ ] `screens/auth/{LandingScreen,LoginScreen,RegisterScreen,ForgotPasswordScreen,ResetPasswordScreen}.tsx`
- [ ] Componentes `LoginForm`, `RegisterForm`, etc. con RHF
- [ ] `KeyboardAvoidingView` + `ScrollView` para que el teclado no tape los campos
- [ ] `handleAuthError` con `sonner-native` para los toasts
- [ ] Branding: reutilizar mascota + logo del `assets/brand/` del web

**Criterio de aceptación**
- Login real contra el backend funciona en iOS y Android.
- Mensajes de error mapean correctamente (invalid_credentials, validation_error, etc.).

**Depende de**: 1.3, 1.4, 1.7

---

### Issue 2.2 — Logout + cleanup de SecureStore/MMKV

**Labels**: `epic:auth`, `priority:p1`

**Tareas**
- [ ] Botón logout en Profile + ítem en menú
- [ ] `useAuth.logout()` llama a `authService.logout({ refreshToken })`, limpia SecureStore, MMKV, `queryClient.clear()`, navega a Landing
- [ ] Confirmación opcional (alert)

**Depende de**: 2.1

---

## Épica 3 — Features de dominio (paridad con web)

### Issue 3.1 — Dashboard screen

**Labels**: `epic:feature`, `priority:p1`

**Contexto**: portar `pages/app/DashboardPage.tsx`. Reutilizar `useProgress` (mismo endpoint).

**Tareas**
- [ ] `screens/app/DashboardScreen.tsx`: WelcomeCard, StatsGrid, XpLevelCard, ActivityCalendar, RecentAchievements, QuickStudyCta
- [ ] Portar `features/dashboard/hooks/useDashboard.ts` (lectura del store + isLoading del query)
- [ ] `lib/xp.utils.ts` portado para `getUserLevel`
- [ ] `RefreshControl` con `query.refetch` en el pull-to-refresh

**Criterio de aceptación**
- Dashboard muestra XP, racha, badges y CTA a "Estudiar ahora".
- Pull to refresh actualiza progress.

**Depende de**: 1.5, 1.7, 2.1

---

### Issue 3.2 — Decks: lista, detalle, CRUD

**Labels**: `epic:feature`, `priority:p1`

**Tareas**
- [ ] `services/decks.service.ts` portado del web
- [ ] `features/decks/hooks/useDecks.ts` y `useDeckDetail`
- [ ] `screens/app/decks/{DecksScreen,DeckDetailScreen}.tsx`
- [ ] Componentes: `DeckCard`, `DeckGrid` (FlatList), `DeckForm` (RHF), `DeckDeleteDialog` (Modal)
- [ ] Búsqueda con `useDebouncedValue`
- [ ] Empty state con mascota

**Depende de**: 3.0 (issue 1.5)

---

### Issue 3.3 — Flashcards: CRUD dentro del deck

**Labels**: `epic:feature`, `priority:p1`

**Tareas**
- [ ] `services/flashcards.service.ts` portado
- [ ] `features/decks/hooks/useFlashcards.ts`
- [ ] `FlashcardForm` + `FlashcardItem` + `FlashcardList` (FlatList con keyExtractor)
- [ ] Botones difficulty (EASY/MEDIUM/HARD) como segmented control

**Depende de**: 3.2

---

### Issue 3.4 — Study session: flip + rating + SM-2

**Labels**: `epic:feature`, `priority:p0`

**Contexto**: el corazón de la app. Portar `features/study/`.

**Tareas**
- [ ] `services/flashcards.service.listDue + review` ya cubiertos en 3.3
- [ ] `useStudySession` portado con `useState` + `useRef`
- [ ] `FlashcardFlip` con animación: usar `react-native-reanimated` v3 para el flip 3D (no se puede CSS) — efecto card-flip con `rotateY` interpolado
- [ ] `DifficultyRating` (3 botones grandes touch-friendly)
- [ ] `StudyProgressBar`
- [ ] `StudyComplete` con confeti (`react-native-confetti-cannon`) y resumen
- [ ] `LevelUpModal` y `XpGainAnimation` con Reanimated
- [ ] **Haptics**: `expo-haptics` en flip y rate (`Haptics.impactAsync(Light/Medium)`)
- [ ] **Lock orientación a portrait** durante la sesión

**Criterio de aceptación**
- Sesión completa funciona end-to-end; SM-2 reprograma en backend; XP/streak se actualizan; level-up detecta cambio.

**Depende de**: 3.2, 3.3

---

### Issue 3.5 — Documents: subida PDF + polling + generación IA

**Labels**: `epic:feature`, `priority:p1`

**Contexto**: el web sube PDFs con `<input type="file">`. En RN se necesita `expo-document-picker`.

**Tareas**
- [ ] `services/documents.service.ts` portado
- [ ] `expo-document-picker` para seleccionar PDF (filtrar `application/pdf`)
- [ ] `useDocumentUpload` con `useMutation` (igual que web post-refactor)
- [ ] `useDocumentStatusPolling` y `useAiJobPolling` con **backoff exponencial** (3s → 30s, igual que web)
- [ ] `PdfUploadZone` con drag zone visual (no funcional en RN, solo botón "Seleccionar PDF")
- [ ] `DocumentStatusCard`, `JobStatusCard`
- [ ] `MarkdownPreview` con `react-native-markdown-display`
- [ ] `GenerateFlashcardsForm` con selector de deck

**Criterio de aceptación**
- Upload + polling + generación IA → flashcards aparecen en el deck destino.

**Depende de**: 3.2

---

### Issue 3.6 — Courses

**Labels**: `epic:feature`, `priority:p2`

**Tareas**
- [ ] Portar `services/courses.service.ts`, `features/courses/`, `screens/app/CoursesScreen.tsx`
- [ ] `CourseTable` → `FlatList` con `CourseCard`
- [ ] `RoleGuard` para botones de create/delete según permission

---

### Issue 3.7 — Achievements

**Labels**: `epic:feature`, `priority:p2`

**Tareas**
- [ ] Portar `services/achievements.service.ts`, `features/achievements/`
- [ ] `AchievementsGrid` (FlatList con `numColumns={2}`)
- [ ] `BadgeCard`, `BadgeUnlockedModal` con animación de entrada
- [ ] Imágenes de badges del `assets/brand/levels/`

---

### Issue 3.8 — Store (compras XP)

**Labels**: `epic:feature`, `priority:p2`

**Tareas**
- [ ] Portar `services/store.service.ts`, `features/store/`
- [ ] `RoleGuard permission="view:store"` en el screen (mobile equivalent)
- [ ] `StreakFreezeCard`, `PurchaseConfirmDialog`
- [ ] Confirmar compra con `Alert.alert` antes de mutation

---

### Issue 3.9 — Leaderboard

**Labels**: `epic:feature`, `priority:p2`

**Tareas**
- [ ] Portar `services/leaderboard.service.ts`, `features/leaderboard/`
- [ ] Respetar feature flag `EXPO_PUBLIC_FEATURE_LEADERBOARD`
- [ ] `LeaderboardTable` → `FlatList` con `RankBadge`
- [ ] Skeleton mientras carga, empty/unavailable state

---

### Issue 3.10 — Profile

**Labels**: `epic:feature`, `priority:p1`

**Tareas**
- [ ] Portar `services/auth.service` change-password si existe, `features/profile/`
- [ ] `ProfileHeader`, `BadgesCollection`, `StatsPanel`, `SecuritySection`
- [ ] Botón logout (del issue 2.2)
- [ ] Toggle de notificaciones push

---

### Issue 3.11 — Notifications: bell + badge + lista

**Labels**: `epic:feature`, `priority:p2`

**Tareas**
- [ ] Portar `services/notifications.service.ts`, `features/notifications/`
- [ ] Badge con contador no leído en TopBar (header de cada screen)
- [ ] Modal o screen con lista; mark read / mark all read

---

### Issue 3.12 — Analytics

**Labels**: `epic:feature`, `priority:p2`

**Tareas**
- [ ] Portar `services/analytics.service.ts`
- [ ] `ActivityHeatmap` → adaptar con `victory-native` o `react-native-svg-charts` (recharts no funciona en RN)
- [ ] Pantalla con KPIs y heatmap de actividad

---

## Épica 4 — Mobile-native (diferenciadores vs web)

### Issue 4.1 — Push notifications con Expo Notifications

**Labels**: `epic:mobile-native`, `priority:p1`

**Contexto**: recordatorios de racha diaria, achievement unlocked, flashcards listas para repasar.

**Tareas**
- [ ] `expo-notifications` setup (permisos en onboarding tras login)
- [ ] Obtener Expo push token y enviar al backend (`POST /users/me/push-token` — coordinar con backend)
- [ ] Handler de notificación entrante (foreground + background)
- [ ] Deep link desde notificación: tap → navega a `/study/{deckId}` o `/achievements`
- [ ] Local notification para recordatorio diario configurable

**Depende de**: 1.7, 3.10

---

### Issue 4.2 — Offline support / sync queue

**Labels**: `epic:mobile-native`, `priority:p1`

**Contexto**: mobile real implica sesiones de estudio sin conexión. El web no lo cubre por completo.

**Tareas**
- [ ] React Query persistence con AsyncStorage para `progress`, `decks`, `flashcards/due`
- [ ] Detectar `NetInfo` y mostrar banner offline
- [ ] Cola de mutaciones (`POST /flashcards/{id}/review`, `POST /users/me/progress/review`) en MMKV; flush al recuperar conexión
- [ ] Resolver conflictos: timestamp del cliente vs servidor

**Criterio de aceptación**
- Estudiar 10 cards en avión, conectar wifi → reviews y XP se sincronizan.

**Depende de**: 1.5, 3.4

---

### Issue 4.3 — Deep linking + Universal Links

**Labels**: `epic:mobile-native`, `priority:p2`

**Tareas**
- [ ] Configurar scheme `streakstudy://` y `https://streakstudy.app/*`
- [ ] `linking` config en React Navigation
- [ ] Soportar: `/study/{deckId}`, `/decks/{deckId}`, `/reset-password?token=...`
- [ ] Probar desde mail (reset password), notificación push y safari

---

### Issue 4.4 — Biometric auth (Face ID / Touch ID / fingerprint)

**Labels**: `epic:mobile-native`, `priority:p2`

**Tareas**
- [ ] `expo-local-authentication` setup
- [ ] Toggle en Settings: "Bloquear app con Face ID"
- [ ] Si activado, al abrir la app pedir biometría antes de leer refreshToken
- [ ] Fallback a password tras N intentos fallidos

**Depende de**: 1.4

---

### Issue 4.5 — Haptics + sonidos en gamificación

**Labels**: `epic:mobile-native`, `priority:p2`

**Tareas**
- [ ] `expo-haptics` en: flip, rate, level-up, badge unlocked
- [ ] `expo-av` para sonidos cortos en level-up y streak extended (opcional, toggle en settings)
- [ ] Respetar modo silencio del sistema

**Depende de**: 3.4

---

### Issue 4.6 — Background fetch para racha diaria

**Labels**: `epic:mobile-native`, `priority:p2`

**Contexto**: si el usuario no abre la app a las 23:00 y tiene `streakFreezes`, el backend lo consume automáticamente. Notificación local de aviso a las 20:00.

**Tareas**
- [ ] `expo-background-fetch` o `expo-task-manager`
- [ ] Programar local notification "Tu racha está en riesgo" si no hay sesión completada en el día
- [ ] Cancelar notification al completar sesión

---

## Épica 5 — Quality

### Issue 5.1 — Tests críticos

**Labels**: `epic:quality`, `priority:p1`

**Contexto**: replicar la cobertura del web post-hardening — refresh interceptor, RoleGuard, handleAuthError, hooks de auth.

**Tareas**
- [ ] Jest + `@testing-library/react-native` + `react-native-testing-mocks`
- [ ] Polyfill `expo-secure-store` y `react-native-mmkv` con mocks en setup
- [ ] Tests del refresh interceptor (mismos 4 casos del web)
- [ ] Tests de RoleGuard (7 casos)
- [ ] Tests de `handleAuthError` (7 casos)
- [ ] Test del navigator gating según `useSessionStore.status`

**Criterio de aceptación**
- `npm test` con ≥ 20 tests pasando.

---

### Issue 5.2 — CI con GitHub Actions + EAS Build

**Labels**: `epic:quality`, `priority:p1`

**Tareas**
- [ ] Workflow CI: install + lint + typecheck + test en cada PR
- [ ] EAS Build preview para PRs (build interno, link en el PR)
- [ ] EAS Submit a TestFlight / Internal Testing en merge a `main`
- [ ] Secrets en GH: `EXPO_TOKEN`, `EXPO_PUBLIC_API_URL_PROD`

---

### Issue 5.3 — Error tracking con Sentry

**Labels**: `epic:quality`, `priority:p2`

**Tareas**
- [ ] `sentry-expo` o `@sentry/react-native` setup
- [ ] Capturar excepciones no manejadas + render errors (ErrorBoundary)
- [ ] Source maps a Sentry desde EAS Build
- [ ] PII filtering (no enviar email/token en breadcrumbs)

---

### Issue 5.4 — A11y baseline

**Labels**: `epic:quality`, `priority:p2`

**Tareas**
- [ ] `accessibilityLabel` en todos los `Pressable`/`TouchableOpacity` solo-ícono
- [ ] `accessibilityRole` correcto en botones, headers, listas
- [ ] Probar con VoiceOver (iOS) y TalkBack (Android) los flujos: login, study, dashboard
- [ ] Dynamic Type: usar `useWindowDimensions` + `PixelRatio.getFontScale()` para escalar textos

---

## Épica B — Backend (`proyecto-1-streakstudy`): soporte SUPER_ADMIN

> Continúa la numeración B.1–B.8 ya usada en el backend. Bloquean el panel de SUPER_ADMIN del frontend web (PR 3): sin B.9 no se puede crear el admin de una institución desde la UI, y sin B.10 el dashboard de uso no tiene datos.

### Issue B.9 — Alta de INSTITUTION_ADMIN por SUPER_ADMIN (cross-tenant)

**Labels**: `epic:backend`, `priority:p1`

**Contexto**: `POST /api/v1/users` (PR #38) solo cubre TEACHER→STUDENT e INSTITUTION_ADMIN→{STUDENT,TEACHER}. SUPER_ADMIN no figura en `ASSIGNABLE_ROLES` (`UserManagementService`) y el endpoint infiere el `institutionId` de `TenantContext` — un SUPER_ADMIN no puede indicar *para qué institución* crea el admin.

**Tareas**
- [ ] Extender `ASSIGNABLE_ROLES` con `SUPER_ADMIN → {STUDENT, TEACHER, INSTITUTION_ADMIN}` (nunca SUPER_ADMIN)
- [ ] Agregar `SUPER_ADMIN` al `@PreAuthorize` del `POST /users` (`UserController.USER_CREATORS`)
- [ ] Aceptar `institutionId` opcional en `CreateUserRequest` **solo honrado si el creador es SUPER_ADMIN**; para TEACHER/INSTITUTION_ADMIN se sigue infiriendo de `TenantContext` y se rechaza si viene en el body (400) — mantiene la garantía anti cross-tenant
- [ ] Validar que la institución destino existe y está activa (404/422 si no)
- [ ] Tests: SUPER_ADMIN crea INSTITUTION_ADMIN en institución X → 201 con `institutionId` X; SUPER_ADMIN crea SUPER_ADMIN → 403; TEACHER con `institutionId` en body → 400; SUPER_ADMIN sin `institutionId` → 400
- [ ] Regenerar `docs/openapi.json`

**Criterio de aceptación**
- Un SUPER_ADMIN autenticado puede crear el INSTITUTION_ADMIN de cualquier institución activa vía API, y ninguna combinación previa de la matriz cambia de comportamiento.

---

### Issue B.10 — Métricas de plataforma para dashboard de SUPER_ADMIN

**Labels**: `epic:backend`, `priority:p1`

**Contexto**: todos los analytics existentes son por usuario (`/api/v1/users/me/...`, `AnalyticsController`). El dashboard de SUPER_ADMIN del frontend necesita agregados de plataforma: uso de tokens de IA, usuarios activos, decks creados, instituciones, etc.

**Tareas**
- [ ] `GET /api/v1/admin/stats` con `@PreAuthorize("hasAuthority('SUPER_ADMIN')")`
- [ ] Response con: `totalUsers`, `activeUsers` (con actividad en los últimos 30 días), `totalInstitutions`, `totalDecks`, `totalFlashcards`, `totalReviews`, `aiTokensUsed` (acumulado del proveedor de IA — hoy Gemini), `usersByRole`
- [ ] Desglose por institución: `GET /api/v1/admin/stats/institutions` → lista con `{ institutionId, name, users, decks, reviews }` (para el ranking del dashboard)
- [ ] Los queries agregados **no** pasan por `TenantContext` (son cross-tenant a propósito) — documentar por qué en el service
- [ ] Persistir/acumular el consumo de tokens de IA por request si aún no se registra (columna o tabla `ai_usage`)
- [ ] Tests: STUDENT/TEACHER/INSTITUTION_ADMIN → 403; SUPER_ADMIN → 200 con agregados correctos sobre datos seed
- [ ] Regenerar `docs/openapi.json`

**Criterio de aceptación**
- Con datos seed, los agregados cuadran con lo insertado y solo SUPER_ADMIN puede consultarlos.

---

## Resumen

| Épica          | Issues | Prioridad |
|----------------|--------|-----------|
| Foundation     | 8      | P0        |
| Auth           | 2      | P0–P1     |
| Features       | 12     | P0–P2     |
| Mobile-native  | 6      | P1–P2     |
| Quality        | 4      | P1–P2     |
| Backend (B.*)  | 2      | P1        |
| **Total**      | **34** |           |

**Ruta crítica P0 → MVP demo**: 1.1 → 1.2 → 1.3 → 1.4 → 1.5 → 1.6 → 1.7 → 1.8 → 2.1 → 3.1 → 3.2 → 3.4 (≈12 issues encadenados).

Resto puede paralelizarse una vez la fundación está cerrada.


YA SOMOS FINALISTAS!!!!!
