import { BADGE_CATALOG } from '@/features/achievements/hooks/useAchievements'
import { Lock } from 'lucide-react'

interface Props {
  userBadges: string[]
}

export default function BadgesCollection({ userBadges }: Props) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-text-secondary">Insignias</h3>
      <div className="flex flex-wrap gap-2">
        {BADGE_CATALOG.map((b) => {
          const owned = userBadges.includes(b.id)
          return (
            <div
              key={b.id}
              title={b.name}
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${
                owned ? 'bg-orange-500/15 border border-orange-500/30' : 'bg-surface-hover border border-surface-border opacity-40 grayscale'
              }`}
            >
              {owned ? b.icon : <Lock className="w-4 h-4 text-text-muted" />}
            </div>
          )
        })}
      </div>
    </div>
  )
}
