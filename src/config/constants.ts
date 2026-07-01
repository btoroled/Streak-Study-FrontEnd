// En producción (Vercel) se usa ruta relativa: las llamadas van a /api/v1 del
// mismo origen y vercel.json las proxya al backend (evita mixed-content HTTPS→HTTP).
// En dev se apunta al backend local. VITE_API_URL, si se define, tiene prioridad.
export const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? (import.meta.env.PROD ? '' : 'http://localhost:8081')
export const POLL_INTERVAL_MS = 3000
export const MAX_STREAK_FREEZES = 2
export const BADGE_COST_XP = 7
export const STREAK_FREEZE_COST_XP = 5
export const MAX_FILE_SIZE_MB = 20
export const ACCESS_TOKEN_TTL_MS = 15 * 60 * 1000  // 15 min
