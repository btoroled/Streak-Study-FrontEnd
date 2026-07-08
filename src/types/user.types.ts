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

// Alta de usuarios por TEACHER/INSTITUTION_ADMIN (POST /users).
// Sin institutionId: el backend lo infiere del creador (TenantContext).
export interface CreateUserRequest {
  fullName: string
  email: string
  password: string
  role: 'STUDENT' | 'TEACHER'
}

export interface UserResponse {
  userId: number
  institutionId: number
  email: string
  fullName: string
  role: string
}

export interface CurrentUser {
  userId: number
  institutionId: number
  email: string
  fullName: string
  role: UserRole
}
