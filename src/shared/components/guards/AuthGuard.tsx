import { Suspense } from 'react'
import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { useSessionStore } from '@/store/session.store'
import LoadingScreen from '../feedback/LoadingScreen'
import Sidebar from '../app-layout/Sidebar'
import TopBar from '../app-layout/TopBar'
import MobileNav from '../app-layout/MobileNav'

/**
 * Observa el estado de sesión hidratado por SessionInitProvider.
 * El bootstrap vive arriba del router para que GuestGuard pueda reaccionar al mismo.
 */
export default function AuthGuard() {
  const location = useLocation()
  const refreshToken = useAuthStore((s) => s.refreshToken)
  const status = useSessionStore((s) => s.status)

  if (!refreshToken) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />
  }
  if (status === 'error') {
    return <Navigate to="/login?session=expired" replace />
  }
  if (status === 'idle' || status === 'loading') {
    return <LoadingScreen />
  }

  return (
    <div className="flex h-screen bg-surface-base overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 pb-20 lg:pb-6">
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
