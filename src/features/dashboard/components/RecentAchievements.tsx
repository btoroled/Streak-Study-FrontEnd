import { Trophy } from 'lucide-react'
import SectionCard from '@/shared/components/layout/SectionCard'
import { BADGE_MAP } from '@/config/badges'
import { useDashboard } from '../hooks/useDashboard'

export default function RecentAchievements() {
  const { badges } = useDashboard()
  return (
    <SectionCard title="Mis logros">
      {badges.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-4 text-center">
          <Trophy className="w-8 h-8 text-text-muted" />
          <p className="text-sm text-text-secondary">Aún no tienes logros.</p>
          <p className="text-xs text-text-muted">¡Estudia para ganarlos!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {badges.map((id) => {
            const def = BADGE_MAP[id]
            if (!def) return null
            return (
              <div key={id} className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-[#a78bfa]/10 border border-[#a78bfa]/30 flex items-center justify-center">
                  <Trophy className="w-3.5 h-3.5 text-[#a78bfa]" />
                </div>
                <div>
                  <p className="text-xs font-medium text-text-primary">{def.name}</p>
                  <p className="text-xs text-text-muted">{def.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </SectionCard>
  )
}
