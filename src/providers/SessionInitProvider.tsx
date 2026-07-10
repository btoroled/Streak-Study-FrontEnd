import { useEffect } from 'react'
import { useAuthStore } from '@/store/auth.store'
import { useSessionStore } from '@/store/session.store'
import { authService } from '@/services/auth.service'
import { progressService } from '@/services/progress.service'

/**
 * Hidrata la sesión al montar la app si hay refreshToken persistido.
 * Está por encima del router para que ambos guards (Auth, Guest) reaccionen
 * al mismo estado en lugar de duplicar la lógica de bootstrap.
 *
 * Flujo:
 * 1. POST /auth/refresh → obtiene accessToken fresco y actualiza tokens en store.
 * 2. GET  /auth/me      → revalida rol/email/fullName contra el backend.
 *    - 401 → sesión inválida → logout forzado.
 *    - otro error → se ignora; la sesión sigue válida vía refresh.
 * 3. GET  /progress     → sincroniza XP/racha (no-fatal si falla).
 */
export function SessionInitProvider({ children }: { children: React.ReactNode }) {
  const setStatus = useSessionStore((s) => s.setStatus)

  // Deps vacías a propósito: este efecto solo debe correr una vez, al montar
  // la app. Login/register/logout (useAuth.ts) manejan `status` directamente
  // sin pasar por acá. Si `refreshToken` o `status` estuvieran en las deps,
  // la rotación de refresh token (BE-1) o el propio setStatus('loading') de
  // abajo cambian el valor observado a mitad de vuelo, React re-ejecuta el
  // efecto, y la cleanup del run anterior cancela el flujo antes de que
  // termine — la sesión nunca llega a 'ready' (queda colgada en "Cargando…").
  useEffect(() => {
    const refreshToken = useAuthStore.getState().refreshToken
    if (!refreshToken || useSessionStore.getState().status !== 'idle') return

    let cancelled = false
    setStatus('loading')

    ;(async () => {
      try {
        const authData = await authService.refresh({ refreshToken })
        if (cancelled) return

        useAuthStore.getState().setTokens({
          accessToken: authData.accessToken,
          refreshToken: authData.refreshToken,
          xp: authData.xp,
        })

        // Revalidate profile against the backend
        try {
          const meData = await authService.me()
          if (!cancelled) {
            useAuthStore.getState().setAuth({
              accessToken: authData.accessToken,
              refreshToken: authData.refreshToken,
              userId: meData.userId,
              institutionId: meData.institutionId,
              email: meData.email,
              fullName: meData.fullName,
              role: meData.role,
              xp: authData.xp,
              emailVerified: meData.emailVerified,
            })
          }
        } catch (meError: unknown) {
          const status = (meError as { response?: { status?: number } })?.response?.status
          if (status === 401) {
            if (!cancelled) {
              useAuthStore.getState().logout()
              setStatus('error')
            }
            return
          }
          // 404 or network error: endpoint may not exist yet — session still valid
        }

        try {
          const progress = await progressService.getProgress()
          if (!cancelled) useAuthStore.getState().setProgress(progress)
        } catch { /* non-fatal: usamos xp del AuthResponse */ }

        if (!cancelled) setStatus('ready')
      } catch {
        if (cancelled) return
        useAuthStore.getState().logout()
        setStatus('error')
      }
    })()

    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- correr una sola vez al montar, ver comentario arriba
  }, [])

  return <>{children}</>
}
