import { Lock, Check } from 'lucide-react'

interface Props {
  id: string
  name: string
  icon: string
  description: string
  xpCost: number
  category: 'purchase' | 'automatic'
  isUnlocked: boolean
  userXp: number
  onBuy?: (id: string) => void
}

export default function BadgeCard({ id, name, icon, description, xpCost, category, isUnlocked, userXp, onBuy }: Props) {
  const canBuy = !isUnlocked && category === 'purchase' && userXp >= xpCost

  return (
    <div className={`relative bg-surface-card border rounded-xl p-4 text-center space-y-2.5 transition-all ${
      isUnlocked ? 'border-[#f97316]/40' : 'border-white/8'
    }`}>
      {isUnlocked && (
        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-gradient-to-br from-[#f97316] to-[#7c3aed] flex items-center justify-center">
          <Check className="w-3 h-3 text-white" strokeWidth={3} />
        </div>
      )}

      {/* Medalla */}
      <div className="relative mx-auto w-16 h-16">
        {isUnlocked && (
          <div
            className="absolute inset-0 rounded-full blur-xl opacity-40"
            style={{ background: 'radial-gradient(circle, #f97316 0%, #7c3aed 70%, transparent 100%)' }}
          />
        )}
        <div className={`relative w-16 h-16 rounded-full flex items-center justify-center text-3xl ${
          isUnlocked
            ? 'bg-gradient-to-br from-[#1e1f2a] to-[#16171f] ring-2 ring-[#f97316]/40'
            : 'bg-surface-overlay border border-surface-border'
        }`}>
          {isUnlocked ? icon : <Lock className="w-6 h-6 text-white/20" />}
        </div>
      </div>

      <div>
        <p className={`text-sm font-semibold ${isUnlocked ? 'text-white' : 'text-white/70'}`}>{name}</p>
        <p className="text-xs text-white/40 mt-0.5">{description}</p>
      </div>

      {!isUnlocked && category === 'purchase' && (
        <button
          disabled={!canBuy}
          onClick={() => canBuy && onBuy?.(id)}
          className="w-full text-xs py-1.5 rounded-lg border transition-colors disabled:opacity-40 disabled:cursor-not-allowed border-orange-500/40 text-orange-400 hover:bg-orange-500/10"
        >
          {canBuy ? `Comprar · ${xpCost} XP` : `${xpCost} XP`}
        </button>
      )}
      {!isUnlocked && category === 'automatic' && (
        <p className="text-xs text-white/30">Se desbloquea jugando</p>
      )}
      {isUnlocked && (
        <p className="text-xs text-[#f97316] font-medium">Desbloqueada</p>
      )}
    </div>
  )
}
