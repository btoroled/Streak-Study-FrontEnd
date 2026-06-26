import { Link } from 'react-router-dom'
import { Flame } from 'lucide-react'
import RegisterForm from '@/features/auth/components/RegisterForm'
import { AuthBrandPanel } from './_AuthBrandPanel'

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex bg-surface-base">
      <AuthBrandPanel />

      <div className="flex flex-1 items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-sm space-y-8">
          <div className="flex items-center gap-2 lg:hidden">
            <Flame className="w-6 h-6 text-[#f97316]" />
            <span className="text-lg font-bold text-text-primary">StreakStudy</span>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-text-primary">Crea tu cuenta</h1>
            <p className="text-sm text-text-secondary mt-1">
              Empieza tu racha hoy mismo, es gratis
            </p>
          </div>

          <RegisterForm />

          <p className="text-sm text-center text-text-secondary">
            ¿Ya tienes cuenta?{' '}
            <Link
              to="/login"
              className="text-[#a78bfa] hover:text-[#f97316] transition-colors font-medium"
            >
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
