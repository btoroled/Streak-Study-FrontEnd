import { Link, useLocation } from 'react-router-dom'
import { MailWarning } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import { ROUTES } from '@/config/routes'

/** Aviso persistente, no bloqueante — el backend no impide el login sin verificar. */
export default function EmailVerificationBanner() {
  const emailVerified = useAuthStore((s) => s.emailVerified)
  const { pathname } = useLocation()

  if (emailVerified || pathname === ROUTES.VERIFY_EMAIL) return null

  return (
    <Link
      to={ROUTES.VERIFY_EMAIL}
      className="flex items-center gap-2 px-4 py-2 bg-[#f97316]/10 border-b border-[#f97316]/20 text-xs text-[#f97316] hover:bg-[#f97316]/15 transition-colors shrink-0"
    >
      <MailWarning className="w-3.5 h-3.5 shrink-0" />
      <span>Verifica tu correo institucional para asegurar tu cuenta.</span>
      <span className="font-semibold underline">Verificar ahora</span>
    </Link>
  )
}
