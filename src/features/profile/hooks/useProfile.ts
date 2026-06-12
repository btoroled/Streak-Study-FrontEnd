import { useAuthStore } from '@/store/auth.store'
import { useQuery } from '@tanstack/react-query'
import { progressService } from '@/services/progress.service'
import { QK } from '@/lib/query-keys'

export function useProfile() {
  const { userId, email, fullName, role, xp, currentStreak, streakFreezes, badges } = useAuthStore()

  const progressQuery = useQuery({
    queryKey: QK.progress,
    queryFn: progressService.getProgress,
    staleTime: 30_000,
  })

  return {
    userId,
    email,
    fullName,
    role,
    xp: progressQuery.data?.xp ?? xp,
    currentStreak: progressQuery.data?.currentStreak ?? currentStreak,
    streakFreezes: progressQuery.data?.streakFreezes ?? streakFreezes,
    badges: progressQuery.data?.badges ?? badges,
    isLoading: progressQuery.isLoading,
  }
}
