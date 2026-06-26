import { KeyRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/shared/components/ui/button'

export default function SecuritySection() {
  const navigate = useNavigate()

  return (
    <div className="bg-surface-card border border-white/8 rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-2">
        <KeyRound className="w-4 h-4 text-white/40" />
        <span className="text-sm font-medium text-white">Seguridad</span>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate('/forgot-password')}
      >
        Cambiar contraseña
      </Button>
    </div>
  )
}
