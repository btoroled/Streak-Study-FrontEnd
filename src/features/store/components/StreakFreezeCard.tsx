import { Snowflake } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'

const STREAK_FREEZE_COST = 200

interface Props {
  currentFreezes: number
  userXp: number
  onBuy: () => void
  isLoading?: boolean
}

export default function StreakFreezeCard({ currentFreezes, userXp, onBuy, isLoading }: Props) {
  const canBuy = userXp >= STREAK_FREEZE_COST

  return (
    <div className="bg-[#16171f] border border-white/8 rounded-xl p-5 space-y-4">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-500/15 flex items-center justify-center flex-shrink-0">
          <Snowflake className="w-6 h-6 text-blue-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white">Congelador de racha</h3>
          <p className="text-sm text-white/50 mt-0.5">
            Protege tu racha por un día de inactividad
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-sm font-bold text-orange-400">{STREAK_FREEZE_COST} XP</p>
          {currentFreezes > 0 && (
            <p className="text-xs text-blue-400 mt-0.5">Tienes {currentFreezes}</p>
          )}
        </div>
      </div>

      <Button
        className="w-full"
        loading={isLoading}
        disabled={!canBuy}
        onClick={onBuy}
      >
        {canBuy ? 'Comprar congelador' : `Necesitas ${STREAK_FREEZE_COST - userXp} XP más`}
      </Button>
    </div>
  )
}
