import { Lock } from 'lucide-react'

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
    <div className={`relative bg-[#16171f] border rounded-xl p-4 text-center space-y-2 transition-all ${
      isUnlocked ? 'border-orange-500/30 bg-orange-500/5' : 'border-white/8 opacity-70'
    }`}>
      <div className="text-3xl">{isUnlocked ? icon : <Lock className="w-7 h-7 text-white/20 mx-auto" />}</div>
      <div>
        <p className="text-sm font-semibold text-white">{name}</p>
        <p className="text-xs text-white/40 mt-0.5">{description}</p>
      </div>
      {!isUnlocked && category === 'purchase' && (
        <button
          disabled={!canBuy}
          onClick={() => canBuy && onBuy?.(id)}
          className="w-full text-xs py-1.5 rounded-lg border transition-colors disabled:opacity-40 disabled:cursor-not-allowed border-orange-500/40 text-orange-400 hover:bg-orange-500/10"
        >
          {xpCost} XP
        </button>
      )}
      {isUnlocked && (
        <p className="text-xs text-orange-400 font-medium">Desbloqueada ✓</p>
      )}
    </div>
  )
}
