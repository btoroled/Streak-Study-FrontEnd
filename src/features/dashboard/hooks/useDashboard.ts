import { useProgress } from '@/hooks/useProgress'
import { useAuthStore } from '@/store/auth.store'
import { getUserLevel } from '@/lib/xp.utils'

export function useDashboard() {
  const { data: progress, isLoading, error, refetch } = useProgress()
  const { xp, currentStreak, streakFreezes, badges, fullName, email } = useAuthStore()

  // Use store snapshot while query loads (already synced on session init)
  const displayXp = progress?.xp ?? xp
  const displayStreak = progress?.currentStreak ?? currentStreak
  const displayFreezes = progress?.streakFreezes ?? streakFreezes
  const displayBadges = progress?.badges ?? badges
  const levelInfo = getUserLevel(displayXp)

  const displayName = fullName ?? email?.split('@')[0] ?? 'Estudiante'

  return {
    isLoading,
    error,
    refetch,
    displayName,
    xp: displayXp,
    currentStreak: displayStreak,
    streakFreezes: displayFreezes,
    badges: displayBadges,
    levelInfo,
  }
}
