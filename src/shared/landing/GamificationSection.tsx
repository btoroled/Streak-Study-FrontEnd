import { Trophy } from 'lucide-react'

export default function GamificationSection() {
  return (
    <div className="bg-surface-card border border-surface-border rounded-xl p-5">
      <Trophy className="w-6 h-6 text-brand-yellow mb-3" />
      <p className="text-sm font-semibold text-text-primary mb-1">Rachas, XP y ranking</p>
      <p className="text-xs text-text-secondary leading-relaxed">
        Sube de nivel, mantén tu racha diaria y compite en el ranking de tu institución.
      </p>
    </div>
  )
}
