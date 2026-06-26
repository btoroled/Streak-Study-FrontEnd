import { Link, useSearchParams } from 'react-router-dom'
import { Flame, AlertTriangle, CheckCircle } from 'lucide-react'
import LoginForm from '@/features/auth/components/LoginForm'
import { AuthBrandPanel } from './_AuthBrandPanel'

export default function LoginPage() {
  const [searchParams] = useSearchParams()
  const sessionExpired = searchParams.get('session') === 'expired'
  const resetSuccess = searchParams.get('reset') === 'success'

  return (
    <div className="min-h-screen flex bg-surface-base">
      <AuthBrandPanel />

      <div className="flex flex-1 items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-sm space-y-8">
          {/* Mobile-only logo */}
          <div className="flex items-center gap-2 lg:hidden">
            <Flame className="w-6 h-6 text-[#f97316]" />
            <span className="text-lg font-bold text-text-primary">StreakStudy</span>
          </div>

          {/* Alert banners */}
          {sessionExpired && (
            <div className="flex items-start gap-3 p-3 rounded-lg bg-[#f59e0b]/10 border border-[#f59e0b]/30">
              <AlertTriangle className="w-4 h-4 text-[#f59e0b] mt-0.5 shrink-0" />
              <p className="text-sm text-text-primary">
                Tu sesión expiró. Ingresa de nuevo para continuar.
              </p>
            </div>
          )}
          {resetSuccess && (
            <div className="flex items-start gap-3 p-3 rounded-lg bg-[#22c55e]/10 border border-[#22c55e]/30">
              <CheckCircle className="w-4 h-4 text-[#22c55e] mt-0.5 shrink-0" />
              <p className="text-sm text-text-primary">
                Contraseña actualizada. Ingresa con tu nueva contraseña.
              </p>
            </div>
          )}

          <div>
            <h1 className="text-2xl font-bold text-text-primary">Bienvenido de vuelta</h1>
            <p className="text-sm text-text-secondary mt-1">Continúa tu racha de hoy</p>
          </div>

          <LoginForm />

          <p className="text-sm text-center text-text-secondary">
            ¿No tienes cuenta?{' '}
            <Link
              to="/register"
              className="text-[#a78bfa] hover:text-[#f97316] transition-colors font-medium"
            >
              Regístrate gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
