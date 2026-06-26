import { Trophy } from 'lucide-react'

export default function LeaderboardUnavailable() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
      <div className="w-14 h-14 rounded-2xl bg-surface-overlay border border-surface-border flex items-center justify-center">
        <Trophy className="w-7 h-7 text-white/20" />
      </div>
      <p className="text-text-primary font-semibold">Leaderboard no disponible</p>
      <p className="text-sm text-white/40 max-w-xs">
        El ranking estará disponible pronto. ¡Sigue acumulando XP!
      </p>
    </div>
  )
}
