import api from './api.client'
import type { LeaderboardUserResponse } from '@/types/user.types'

export const leaderboardService = {
  // BUG-03: LeaderboardController not yet implemented — returns 404 gracefully
  getLeaderboard: async (): Promise<LeaderboardUserResponse[]> => {
    try {
      const r = await api.get<LeaderboardUserResponse[]>('/leaderboard')
      return r.data
    } catch {
      return []
    }
  },
}
