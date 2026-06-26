import { Link } from 'react-router-dom'
import { Flame, ArrowLeft } from 'lucide-react'
import ForgotPasswordForm from '@/features/auth/components/ForgotPasswordForm'
import { AuthBrandPanel } from './_AuthBrandPanel'

export default function ForgotPasswordPage() {
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
            <h1 className="text-2xl font-bold text-text-primary">Recupera tu acceso</h1>
            <p className="text-sm text-text-secondary mt-1">
              Te enviaremos un enlace a tu correo institucional
            </p>
          </div>

          <ForgotPasswordForm />

          <Link
            to="/login"
            className="flex items-center justify-center gap-1.5 text-sm text-text-secondary hover:text-[#a78bfa] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  )
}
