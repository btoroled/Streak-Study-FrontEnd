import { useQuery } from '@tanstack/react-query'
import { leaderboardService } from '@/services/leaderboard.service'
import { QK } from '@/lib/query-keys'

export function useLeaderboardQuery() {
  return useQuery({
    queryKey: QK.leaderboard,
    queryFn: leaderboardService.getLeaderboard,
    staleTime: 60_000,
  })
}
