import { Link } from 'react-router-dom'
import { Flame, ArrowLeft } from 'lucide-react'
import ResetPasswordForm from '@/features/auth/components/ResetPasswordForm'
import { AuthBrandPanel } from './_AuthBrandPanel'

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex bg-[#0f0f14]">
      <AuthBrandPanel />

      <div className="flex flex-1 items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-sm space-y-8">
          <div className="flex items-center gap-2 lg:hidden">
            <Flame className="w-6 h-6 text-[#f97316]" />
            <span className="text-lg font-bold text-[#f1f0f5]">StreakStudy</span>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-[#f1f0f5]">Nueva contraseña</h1>
            <p className="text-sm text-[#9896a8] mt-1">
              El enlace es válido por 30 minutos
            </p>
          </div>

          <ResetPasswordForm />

          <Link
            to="/login"
            className="flex items-center justify-center gap-1.5 text-sm text-[#9896a8] hover:text-[#a78bfa] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  )
}
