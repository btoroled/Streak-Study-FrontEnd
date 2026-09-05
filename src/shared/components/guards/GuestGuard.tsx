import { Outlet, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { useSessionStore } from '@/store/session.store'
import LoadingScreen from '../feedback/LoadingScreen'

/**
 * Si el usuario llega con sesión válida (refreshToken persistido) a una ruta
 * pública, lo enviamos a /dashboard una vez SessionInitProvider la hidrata.
 * Mientras hidrata evitamos un flash de la página de login.
 */
export default function GuestGuard() {
  const hasSession = useAuthStore((s) => s.hasSession)
  const status = useSessionStore((s) => s.status)

  if (hasSession && (status === 'idle' || status === 'loading')) {
    return <LoadingScreen />
  }
  if (hasSession && status === 'ready') {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
