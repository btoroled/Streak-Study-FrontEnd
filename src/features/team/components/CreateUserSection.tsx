import { UserPlus } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import CreateUserForm from './CreateUserForm'

export default function CreateUserSection() {
  const role = useAuthStore((s) => s.role)
  const isSuperAdmin = role === 'SUPER_ADMIN'

  return (
    <div className="bg-surface-card border border-white/8 rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-2">
        <UserPlus className="w-4 h-4 text-white/40" />
        <span className="text-sm font-medium text-white">Dar de alta usuarios</span>
      </div>
      <p className="text-xs text-text-muted">
        {isSuperAdmin
          ? 'El usuario se crea en la institución que elijas, con la contraseña inicial que definas.'
          : 'El usuario se crea en tu institución con la contraseña inicial que definas.'}
      </p>
      <CreateUserForm />
    </div>
  )
}
