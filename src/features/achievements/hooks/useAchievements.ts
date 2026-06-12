import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { achievementsService } from '@/services/achievements.service'
import { progressService } from '@/services/progress.service'
import { useAuthStore } from '@/store/auth.store'
import { QK } from '@/lib/query-keys'
import { getErrorMessage } from '@/lib/error.utils'

export const BADGE_CATALOG = [
  { id: 'badge_streak_7',   name: 'Racha 7 días',    icon: '🔥', xpCost: 0,   category: 'automatic' as const, description: 'Mantén una racha de 7 días' },
  { id: 'badge_streak_30',  name: 'Racha 30 días',   icon: '⚡', xpCost: 0,   category: 'automatic' as const, description: 'Mantén una racha de 30 días' },
  { id: 'badge_100_cards',  name: '100 flashcards',  icon: '📚', xpCost: 0,   category: 'automatic' as const, description: 'Revisa 100 flashcards en total' },
  { id: 'badge_gold',       name: 'Insignia Oro',    icon: '🥇', xpCost: 500, category: 'purchase'  as const, description: 'Muestra tu dedicación al estudio' },
  { id: 'badge_diamond',    name: 'Insignia Diamante',icon: '💎', xpCost: 1000,category: 'purchase' as const, description: 'Para los estudiantes más comprometidos' },
  { id: 'badge_owl',        name: 'Búho Sabio',      icon: '🦉', xpCost: 750, category: 'purchase'  as const, description: 'El símbolo del conocimiento' },
]

export function useAchievements() {
  const qc = useQueryClient()
  const setProgress = useAuthStore((s) => s.setProgress)
  const userBadges = useAuthStore((s) => s.badges)
  const xp = useAuthStore((s) => s.xp)

  const buyBadge = useMutation({
    mutationFn: (badgeName: string) => achievementsService.buyBadge({ badgeName }),
    onSuccess: async () => {
      toast.success('¡Insignia adquirida!')
      try {
        const progress = await progressService.getProgress()
        setProgress(progress)
        qc.invalidateQueries({ queryKey: QK.progress })
      } catch { /* silent */ }
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  })

  return { badges: BADGE_CATALOG, userBadges, xp, buyBadge }
}
