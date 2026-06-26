import { useProgress } from '@/hooks/useProgress'
import { useAuthStore } from '@/store/auth.store'
import { getUserLevel } from '@/lib/xp.utils'

export function useDashboard() {
  const { isLoading, error, refetch } = useProgress()
  const xp = useAuthStore((s) => s.xp)
  const currentStreak = useAuthStore((s) => s.currentStreak)
  const streakFreezes = useAuthStore((s) => s.streakFreezes)
  const badges = useAuthStore((s) => s.badges)
  const fullName = useAuthStore((s) => s.fullName)
  const email = useAuthStore((s) => s.email)

  const displayName = fullName ?? email?.split('@')[0] ?? 'Estudiante'

  return {
    isLoading,
    error,
    refetch,
    displayName,
    xp,
    currentStreak,
    streakFreezes,
    badges,
    levelInfo: getUserLevel(xp),
  }
}
