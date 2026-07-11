# Issues — StreakStudy Web (mejoras post-MVP)

Backlog de mejoras para **este repo** (`proyecto-2-frontend-streakstudy`), detectadas de cara a la final. Un issue por bloque — copiar y pegar en GitHub. El backlog del mobile vive en `ISSUES.md`; los issues de backend continúan la numeración B.* (B.9–B.10 en `ISSUES.md`).

**Labels sugeridas**: `epic:ux`, `epic:auth`, `epic:study`, `epic:documents`, `epic:analytics`, `epic:landing`, `epic:classroom`, `epic:backend`, `priority:p0`, `priority:p1`, `priority:p2`.

---

## Épica W1 — App shell / UX

### Issue W1.1 — Toggle dark/light en el menú

**Labels**: `epic:ux`, `priority:p1`

**Contexto**: `providers/ThemeProvider.tsx` envuelve `next-themes`, pero **ningún componente consume `useTheme`** — hoy no existe toggle funcional. El diseño es dark-first (tokens en `src/index.css`), así que activar modo claro implica definir los tokens light, no solo el switch. El toggle va en el **menú/sidebar**, no en la página de Perfil.

**Tareas**
- [ ] Definir variantes light de los tokens semánticos (`surface-base`, `surface-overlay`, `text-primary`, `text-secondary`, `surface-border`, …) en `src/index.css` bajo el selector de tema de next-themes
- [ ] Componente `ThemeToggle` (sol/luna, lucide) en `shared/components/ui/`
- [ ] Montarlo en el sidebar/menú de `AppLayout` (no en Perfil)
- [ ] Persistencia del tema (next-themes ya usa localStorage — verificar que `attribute`/`defaultTheme` estén bien configurados en el provider)
- [ ] Revisar pantallas clave en modo claro: login, dashboard, study, decks (contraste legible, sin hex hardcodeados que rompan)

**Criterio de aceptación**
- El toggle en el menú cambia el tema al instante, persiste tras recargar, y las pantallas principales son legibles en ambos modos.

---

### Issue W1.2 — Menú adaptativo por rol

**Labels**: `epic:ux`, `priority:p1`

**Contexto**: el sidebar debe mostrar solo las secciones que aplican al rol de la sesión (STUDENT / TEACHER / INSTITUTION_ADMIN / SUPER_ADMIN). La matriz de permisos ya existe en `config/roles.ts` (`hasPermission`); hoy el gating se hace por ruta (`RoleGuard`) pero el menú no se adapta de forma consistente.

**Tareas**
- [ ] Definir los ítems del menú de forma declarativa: `{ label, icon, path, permission }` en `config/` (junto a rutas)
- [ ] Filtrar los ítems con `hasPermission(role, permission)` al renderizar el sidebar
- [ ] Verificar la matriz por rol: STUDENT no ve gestión de clase ni admin; TEACHER ve su gestión de clase (W7.1); INSTITUTION_ADMIN ve alta de usuarios; SUPER_ADMIN ve el panel de plataforma
- [ ] Tests del filtrado del menú por rol (4 roles × secciones visibles)

**Criterio de aceptación**
- Con sesiones de los 4 roles, el menú muestra exactamente las secciones permitidas y ninguna ruta oculta es alcanzable por URL directa (RoleGuard sigue cubriendo).

**Depende de**: `config/roles.ts` existente; coordina con W7.1 para el ítem de clase.

---

## Épica W2 — Auth y seguridad

### Issue W2.1 — Bug: instituciones no cargan + blindaje contra alta de SUPER_ADMIN

**Labels**: `epic:auth`, `priority:p0`

**Estado: RESUELTO (2026-07-10)** — diagnóstico completo y fix en backend, rama `fix/w21-institucion-plataforma-reservada` (commit `958fb74`).

**Hallazgos de la investigación**
- `GET /institutions` **es público** y funciona (hipótesis del 401 descartada); `RegisterForm` ya tenía estados de loading/error correctos.
- El "no cargan" que vio el equipo es ambiental: el servidor desplegado está caído (IP inalcanzable) — no es bug del código.
- **Riesgo de deploy detectado**: la DB local tenía columnas legacy `points`/`streak` con `NOT NULL` que el código actual ya no mapea (`ddl-auto=update` nunca borra columnas) → **todo INSERT de usuarios falla y el seeder crashea el boot**. Si la DB de producción tiene el mismo drift, al redeployar correr: `ALTER TABLE users DROP COLUMN points; ALTER TABLE users DROP COLUMN streak;`
- El registro siempre crea STUDENT y `POST /users` ya rechazaba `role: SUPER_ADMIN` (403). **Pero** la institución sentinel "Plataforma (SUPER_ADMIN)" se listaba públicamente y aceptaba registros → cualquiera podía meterse al tenant de administración global.

**Tareas**
- [x] Reproducir con backend local: listado, registro normal, registro forzado a la plataforma, alta SUPER_ADMIN
- [x] Backend: `listActive()` excluye la institución con code `plataforma` (`Institution.PLATFORM_CODE`)
- [x] Backend: `register` rechaza el `institutionId` de la plataforma → `403 reserved_institution` (aunque el id venga a mano)
- [x] Tests unitarios de ambos comportamientos (TDD; suite completa del backend 437/437 verde)
- [ ] Al redeployar: verificar drift de esquema en la DB de producción (ver arriba)
- [ ] Merge de la rama del backend + redeploy

**Criterio de aceptación**
- ✅ El listado público no incluye la Plataforma; registro forzado a ella → 403; registro normal → 201; imposible crear SUPER_ADMIN por API.

---

### Issue W2.2 — Verificación de email al registrarse

**Labels**: `epic:auth`, `priority:p1`

**Contexto**: hoy el registro activa la cuenta directo. Se quiere confirmar el correo con un link/código enviado por email. Requiere backend (B.11). Decisión de UX: **no bloquear el login** de cuentas no verificadas (no romper demo), solo marcar y avisar.

**Tareas**
- [ ] Pantalla post-registro "Revisa tu correo" con botón de reenvío (rate-limited en UI)
- [ ] Ruta `/verify-email?token=...` que llama al endpoint de confirmación y muestra éxito/error (token inválido/expirado)
- [ ] Banner persistente "Verifica tu correo" en la app para sesiones con `emailVerified: false` (campo del perfil)
- [ ] Tipos regenerados cuando B.11 actualice el contrato (`npm run generate:api`)

**Criterio de aceptación**
- Registro → email recibido → click en link → cuenta marcada verificada y banner desaparece.

**Depende de**: B.11 (bloqueante).

---

### Issue W2.3 — Flujo "olvidé mi contraseña" E2E

**Labels**: `epic:auth`, `priority:p1`

**Contexto**: la UI ya existe (`ForgotPasswordPage`, `ResetPasswordPage`, `authService.forgotPassword/resetPassword` contra `/auth/password/forgot|reset`). Lo que falta es verificar que funcione **end-to-end con envío real de correo** y pulir los estados de error.

**Tareas**
- [ ] Probar E2E contra el backend desplegado: solicitar reset → recibir mail → link abre `/reset-password?token=...` → cambia contraseña → login con la nueva
- [ ] Si el mail no llega, es B.12 (backend) — documentar y bloquear en él
- [ ] Estados de error en ResetPassword: token expirado/inválido → mensaje claro + CTA "solicitar de nuevo"
- [ ] No revelar si el email existe (respuesta genérica en Forgot — verificar copy actual)

**Criterio de aceptación**
- Flujo completo funciona con un correo real; token expirado muestra mensaje accionable.

**Depende de**: B.12 (si el envío de correo no está operativo).

---

### Issue W2.4 — Validador de fuerza de contraseña

**Labels**: `epic:auth`, `priority:p2`

**Contexto**: solo frontend. Reglas mínimas en Zod + indicador visual en registro y reset.

**Tareas**
- [ ] Endurecer `registerSchema`/`resetSchema` (`features/auth/schemas/auth.schemas.ts`): mínimo 8, al menos una mayúscula, un número (alinear con lo que valide el backend para no divergir)
- [ ] Componente `PasswordStrengthMeter` (débil/media/fuerte) que reacciona al valor con `useWatch`
- [ ] Integrarlo en `RegisterForm` y `ResetPasswordForm`
- [ ] Tests del cálculo de fuerza y de los mensajes de Zod

**Criterio de aceptación**
- El medidor cambia en vivo al tipear y el submit se bloquea con mensajes claros si no cumple las reglas.

---

## Épica W3 — Estudio y gamificación

### Issue W3.1 — Modo de respuesta escrita

**Labels**: `epic:study`, `priority:p1`

**Contexto**: hoy la sesión de estudio es flip + auto-calificación con click (`features/study/`: `FlashcardFlip`, `DifficultyRating`). Se quiere un modo donde el usuario **escribe la respuesta** antes de ver la solución.

**Tareas**
- [ ] Toggle de modo al iniciar sesión de estudio: "Clásico (flip)" / "Escrito"
- [ ] En modo escrito: input de texto + botón comprobar; comparación normalizada (lowercase, sin acentos, trim) contra la respuesta de la carta
- [ ] Match exacto → feedback correcto y sugerir rating EASY; no-match → mostrar la respuesta real y dejar que el usuario se auto-califique (la respuesta libre no siempre es comparable literalmente)
- [ ] Mantener el mismo `useStudySession` y el mismo `POST review` (SM-2 no cambia); el modo solo altera la UI previa al rating
- [ ] Tests de la normalización/comparación y del flujo match/no-match

**Criterio de aceptación**
- Sesión completa en modo escrito funciona end-to-end y el SM-2/XP se comporta igual que en modo clásico.

---

### Issue W3.2 — Mazos ilimitados + XP decreciente por repetición

**Labels**: `epic:study`, `priority:p1`

**Contexto**: quitar el límite de mazos y desincentivar el farming: repasar el mismo mazo/carta repetidamente el mismo día otorga cada vez menos XP. La mecánica vive en el backend (B.13); el frontend no calcula XP, solo refleja lo que retorna el review.

**Tareas**
- [ ] Verificar que el frontend no asuma un XP fijo por review: `XpGainAnimation` y el mirror de progreso deben usar el XP **del response**, no una constante
- [ ] Quitar cualquier copy/validación de límite de mazos en `features/decks` (no se encontró límite en el frontend — confirmar y cerrar)
- [ ] Mostrar en `StudyComplete` el XP real ganado en la sesión (suma de responses)
- [ ] Regenerar tipos cuando B.13 cambie el contrato

**Criterio de aceptación**
- Repetir un mazo ya repasado muestra el XP reducido que dicta el backend, sin dobles conteos en la UI.

**Depende de**: B.13 (bloqueante para la mecánica; la auditoría del frontend puede hacerse antes).

---

### Issue W3.3 — Bug: el XP mostrado no cuadra

**Labels**: `epic:study`, `priority:p0`

**Estado: RESUELTO (2026-07-10)** — commit `b2ad91d`.

**Causa raíz**: `useStudySession` calculaba el XP de la sesión con una fórmula local (`computeXpGain = max(5, cartas × 2.5)`) que divergía siempre de la del backend (`reviewedCards + durationMinutes/10`). Con 10 cartas en 5 min, la UI anunciaba 25 XP y el server otorgaba 10.

**Tareas**
- [x] Trazar las fuentes de XP: el review por carta no otorga XP; solo `finishReview` lo hace → el delta del response es exacto
- [x] Fix: `xpGained = xp_después − xp_antes` del response de `finishReview`; `computeXpGain` eliminado
- [x] Si la sesión no se confirma (error de red), no se anuncia XP (el toast ya avisa)
- [x] Tests de regresión del hook (delta correcto y caso de error)

**Criterio de aceptación**
- ✅ El XP anunciado en StudyComplete coincide exactamente con el delta que reporta el backend.

---

## Épica W4 — Documentos

### Issue W4.1 — Wizard: PDF → Markdown → Generar → Ver mazo

**Labels**: `epic:documents`, `priority:p1`

**Contexto**: el flujo de `DocumentsPage` (upload, polling de status, preview markdown, generación IA) existe pero como página suelta; se quiere un **flujo guiado** con pasos explícitos que termine llevando al mazo generado.

**Tareas**
- [ ] Stepper de 4 pasos: **1)** Subir PDF → **2)** Ver/confirmar Markdown extraído → **3)** Generar flashcards (selector de deck destino o crear uno nuevo) → **4)** Éxito con CTA "Ver mazo"
- [ ] Reusar los hooks existentes (`useDocumentUpload`, `useDocumentStatusPolling`, `useAiJobPolling`) — el wizard es orquestación de UI, no lógica nueva
- [ ] El paso avanza solo cuando el estado del backend lo permite (PROCESSED, job COMPLETED); errores del polling muestran retry sin perder el paso
- [ ] CTA final navega a `/decks/:id` del mazo destino
- [ ] Test del avance de pasos según estados del job

**Criterio de aceptación**
- Un usuario sube un PDF y sin salir del flujo termina viendo el mazo con las cartas generadas.

---

## Épica W5 — Analytics

### Issue W5.1 — Paleta de colores + layout de 2 columnas (actividad y repasos)

**Labels**: `epic:analytics`, `priority:p2`

**Contexto**: `AnalyticsPage` necesita ajuste visual: colores alineados a los tokens del theme y layout de dos columnas — **actividad** a un lado y **repasos** al otro.

**Tareas**
- [ ] Reemplazar colores ad-hoc de los charts por tokens semánticos (`brand-purple`, `brand-orange`, escala del heatmap coherente con el theme)
- [ ] Grid responsive de 2 columnas (actividad | repasos); colapsa a 1 columna en mobile
- [ ] Revisar contraste en ambos temas cuando W1.1 aterrice

**Criterio de aceptación**
- En desktop se ven las dos columnas lado a lado con la paleta del theme; en mobile apila sin romperse.

---

## Épica W6 — Landing

### Issue W6.1 — Rediseño corporativo estilo Duolingo

**Labels**: `epic:landing`, `priority:p1`

**Contexto**: el landing actual (`shared/landing/`: Hero, HowItWorks, Flashcards, Gamification, Ai, Institutions, Faq, Footer) debe girar hacia un tono más corporativo/product-led al estilo Duolingo: hero grande con mascota + CTA fuerte, secciones con ilustraciones, social proof, copy directo.

**Tareas**
- [ ] Rediseñar `HeroSection`: mascota protagonista, headline corto, CTA primario "Empieza gratis" + CTA secundario para instituciones
- [ ] Ajustar secciones existentes al nuevo tono (copy + espaciado + ilustraciones consistentes)
- [ ] Integrar las nuevas secciones de pricing (W6.3) y contacto (W6.2) en el orden: Hero → HowItWorks → Features → Pricing → FAQ → Contacto → Footer
- [ ] Mantener responsive y tokens del theme

**Criterio de aceptación**
- El landing completo se recorre con el nuevo look sin secciones huérfanas del diseño anterior.

---

### Issue W6.2 — Formulario de contacto en el landing

**Labels**: `epic:landing`, `priority:p1`

**Contexto**: sección de contacto para leads (sobre todo instituciones). Para no depender del backend, el envío va a un servicio externo (Formspree/EmailJS) — decisión consciente para la demo; si luego se quiere persistir en el backend, se abre un B.* aparte.

**Tareas**
- [ ] `ContactSection` en `shared/landing/`: nombre, email, institución (opcional), mensaje
- [ ] Validación con Zod + RHF (mismo patrón del repo)
- [ ] Envío a Formspree (endpoint en variable de entorno `VITE_CONTACT_FORM_URL`); estados enviando/éxito/error con toast
- [ ] Anclaje desde el CTA "Contacto" del navbar/hero (`#contacto`)

**Criterio de aceptación**
- Enviar el formulario entrega el mensaje al correo del equipo y la UI confirma el envío.

---

### Issue W6.3 — Sección de pricing con 4 planes

**Labels**: `epic:landing`, `priority:p1`

**Contexto**: pricing display-only (sin checkout) con 4 espacios. Propuesta de tiers: **Gratis** (estudiante individual), **Pro** (estudiante power: IA ilimitada), **Aula** (profesor + su clase), **Institucional** (colegio/universidad, CTA "Contactar ventas" → W6.2). Precios placeholder definidos por el equipo.

**Tareas**
- [ ] `PricingSection` con 4 cards: nombre, precio, lista de features, CTA (los 3 primeros → registro; Institucional → #contacto)
- [ ] Card destacada (Pro o Aula) con badge "Popular"
- [ ] Responsive: 4 columnas desktop, 2 tablet, 1 mobile
- [ ] Copy de features alineado a lo que la app ya hace (no prometer features inexistentes)

**Criterio de aceptación**
- La sección se ve en el landing con 4 planes, CTAs funcionando y responsive correcto.

---

## Épica W7 — Gestión de clase

### Issue W7.1 — Administrar clase: QR, alta manual y CSV

**Labels**: `epic:classroom`, `priority:p1`

**Contexto**: un TEACHER debe poder poblar su clase de tres formas: **QR/link de invitación** (el alumno se registra solo — ya existe el patrón `?iid=` en `useInstitutionResolver`, falta asociar el curso), **alta manual** (reusar `features/team/CreateUserForm`) e **import CSV** masivo. El roster y el import necesitan backend (B.14).

**Tareas**
- [ ] Vista "Mi clase" por curso: roster de alumnos (nombre, email, estado)
- [ ] Invitación QR: generar link de registro con institución+curso (`/register?iid=X&cid=Y`) y renderizar QR (lib ligera tipo `qrcode.react`); el registro con `cid` inscribe al alumno al curso
- [ ] Alta manual: reusar `CreateUserForm` acotado a `role: STUDENT` con inscripción automática al curso
- [ ] Import CSV: upload + preview de filas parseadas + resultado por fila (creado / error con motivo) según contrato de B.14
- [ ] Gating con `RoleGuard` (TEACHER e INSTITUTION_ADMIN) y entrada en el menú (W1.2)

**Criterio de aceptación**
- Un profesor inscribe alumnos por los tres caminos y el roster refleja los tres orígenes.

**Depende de**: B.14 (roster/CSV/inscripción por curso); W1.2 para el ítem de menú.

---

## Épica B — Backend (`proyecto-1-streakstudy`), continúa B.11+

### Issue B.11 — Verificación de email al registro

**Labels**: `epic:backend`, `priority:p1`

**Tareas**
- [ ] Campo `emailVerified` en users + token de verificación con expiración
- [ ] Envío de correo al registrarse (mismo mecanismo SMTP/proveedor que password reset)
- [ ] `POST /auth/email/verify` (token) y `POST /auth/email/resend` (rate-limited)
- [ ] Exponer `emailVerified` en el perfil; **no** bloquear login de no verificados (decisión de producto para la demo)
- [ ] Tests + regenerar `docs/openapi.json`

**Criterio de aceptación**
- Registro dispara correo; verificar con el token marca la cuenta; reenvío respeta rate limit.

---

### Issue B.12 — Envío real de correos para password reset

**Labels**: `epic:backend`, `priority:p1`

**Contexto**: los endpoints `/auth/password/forgot|reset` ya existen (el frontend ya los consume). Falta garantizar el **envío real** del correo en el entorno desplegado y la expiración del token.

**Tareas**
- [ ] Configurar proveedor de correo en producción (SMTP/SES/Resend) + secrets en el deploy
- [ ] Token de reset con expiración corta (≤1h) y un solo uso
- [ ] Respuesta genérica en forgot (no revelar existencia del email)
- [ ] Test E2E en staging con un correo real

**Criterio de aceptación**
- W2.3 pasa end-to-end contra el backend desplegado.

---

### Issue B.13 — XP decreciente por repetición + mazos ilimitados

**Labels**: `epic:backend`, `priority:p1`

**Contexto**: anti-farming: repasar la misma carta/mazo varias veces el mismo día otorga XP decreciente. Además, eliminar cualquier límite de cantidad de mazos por usuario si existe.

**Tareas**
- [ ] Quitar límite de mazos (si hay validación, eliminarla; si no, confirmar y documentar)
- [ ] Fórmula de XP decreciente **por carta y por día**: `xp = round(base * 0.5^n)` con piso de 1 XP, donde `n` = reviews previos de esa carta en el día (fórmula ajustable, documentar la elegida en el service)
- [ ] El response del review retorna el XP efectivamente otorgado (el frontend lo muestra tal cual — W3.2)
- [ ] Tests: primera review XP completo, segunda mitad, piso de 1; reset al día siguiente
- [ ] Regenerar `docs/openapi.json`

**Criterio de aceptación**
- Farmear un mazo rinde XP marginal decreciente y el response siempre informa el XP real.

---

### Issue B.14 — Endpoints de gestión de clase (roster, CSV, inscripción por invitación)

**Labels**: `epic:backend`, `priority:p1`

**Tareas**
- [ ] `GET /courses/{id}/students` (roster) — TEACHER dueño del curso o INSTITUTION_ADMIN del tenant
- [ ] `POST /courses/{id}/students/import` (CSV multipart): valida por fila, crea STUDENT + inscribe; response con resultado por fila `{ row, status, error? }`
- [ ] Registro con invitación de curso: aceptar `courseId` en el registro (análogo al `iid` actual) e inscribir al alumno al confirmar el alta
- [ ] Alta manual: `POST /users` inscribe al curso si viene `courseId` (validar que el creador tenga permiso sobre ese curso)
- [ ] Tests de permisos (TEACHER de otro curso → 403) + regenerar `docs/openapi.json`

**Criterio de aceptación**
- Los tres caminos de W7.1 tienen contrato estable y probado.

---

## Resumen

| Épica              | Issues | Prioridad |
|--------------------|--------|-----------|
| W1 App shell / UX  | 2      | P1        |
| W2 Auth/seguridad  | 4      | P0–P2     |
| W3 Estudio/XP      | 3      | P0–P1     |
| W4 Documentos      | 1      | P1        |
| W5 Analytics       | 1      | P2        |
| W6 Landing         | 3      | P1        |
| W7 Clase           | 1      | P1        |
| B Backend          | 4      | P1        |
| **Total**          | **19** |           |

**Orden sugerido de ataque**
1. **Bugs P0 primero**: W2.1 (instituciones no cargan) y W3.3 (XP no cuadra) — son bugs visibles en demo.
2. **Solo-frontend de alto impacto visual**: W6.1–W6.3 (landing), W1.1 (toggle), W1.2 (menú por rol), W2.4 (password meter), W4.1 (wizard), W5.1 (analytics).
3. **Los que dependen de backend**: W2.2/B.11, W2.3/B.12, W3.2/B.13, W7.1/B.14 — arrancar los B.* en paralelo con el punto 2.
