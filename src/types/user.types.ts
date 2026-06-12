import type { UserRole } from '@/config/roles'

export interface UserProgressResponse {
  xp: number
  currentStreak: number
  streakFreezes: number
  badges: string[]
}

export interface LeaderboardUserResponse {
  id: number
  fullName: string
  streak: number
  points: number  // maps to XP in backend
}

export interface FinishReviewRequest {
  reviewedCards: number
  durationMinutes: number
}

export interface CurrentUser {
  userId: number
  institutionId: number
  email: string
  fullName: string
  role: UserRole
}
