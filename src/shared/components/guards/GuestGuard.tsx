import { Outlet, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { useSessionStore } from '@/store/session.store'

/**
 * Redirects already-authenticated users away from public pages (login, register…).
 * Only redirects once initSession has completed (status=ready) to avoid
 * bouncing users who have a stale refreshToken that will fail on startup.
 */
export default function GuestGuard() {
  const refreshToken = useAuthStore((s) => s.refreshToken)
  const status = useSessionStore((s) => s.status)

  if (refreshToken && status === 'ready') {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
