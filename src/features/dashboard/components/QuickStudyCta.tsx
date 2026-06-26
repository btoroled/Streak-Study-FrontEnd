import { useNavigate } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import RoleGuard from '@/shared/components/guards/RoleGuard'

export default function QuickStudyCta() {
  const navigate = useNavigate()
  return (
    <RoleGuard permission="finish:review" fallback={null}>
      <div className="bg-gradient-to-br from-[#f97316]/10 to-[#7c3aed]/10 border border-surface-border rounded-xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#f97316] to-[#7c3aed] flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">¿Listo para estudiar?</p>
            <p className="text-xs text-text-secondary">Gana XP y mantén tu racha</p>
          </div>
        </div>
        <Button size="lg" onClick={() => navigate('/study')}>Comenzar sesión</Button>
      </div>
    </RoleGuard>
  )
}
