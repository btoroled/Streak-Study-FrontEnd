import { Suspense, useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { useSessionStore } from '@/store/session.store'
import { useAuth } from '@/features/auth/hooks/useAuth'
import LoadingScreen from '../feedback/LoadingScreen'
import Sidebar from '../app-layout/Sidebar'
import TopBar from '../app-layout/TopBar'
import MobileNav from '../app-layout/MobileNav'

export default function AuthGuard() {
  const navigate = useNavigate()
  const location = useLocation()
  const refreshToken = useAuthStore((s) => s.refreshToken)
  const { status, setStatus } = useSessionStore()
  const { initSession } = useAuth()

  useEffect(() => {
    if (!refreshToken) {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`, { replace: true })
      return
    }
    if (status !== 'idle') return

    setStatus('loading')
    initSession()
      .then(() => setStatus('ready'))
      .catch(() => {
        setStatus('idle')
        navigate('/login?session=expired', { replace: true })
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!refreshToken) return null
  if (status === 'idle' || status === 'loading') return <LoadingScreen />

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
