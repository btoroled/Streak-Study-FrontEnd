import { useEffect } from 'react'
import { useAuthStore } from '@/store/auth.store'
import { useSessionStore } from '@/store/session.store'
import { authService } from '@/services/auth.service'
import { progressService } from '@/services/progress.service'

/**
 * Hidrata la sesión al montar la app si hay refreshToken persistido.
 * Está por encima del router para que ambos guards (Auth, Guest) reaccionen
 * al mismo estado en lugar de duplicar la lógica de bootstrap.
 */
export function SessionInitProvider({ children }: { children: React.ReactNode }) {
  const refreshToken = useAuthStore((s) => s.refreshToken)
  const status = useSessionStore((s) => s.status)
  const setStatus = useSessionStore((s) => s.setStatus)

  useEffect(() => {
    if (!refreshToken || status !== 'idle') return

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
  }, [refreshToken, status, setStatus])

  return <>{children}</>
}
