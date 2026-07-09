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

// Alta de usuarios por TEACHER/INSTITUTION_ADMIN/SUPER_ADMIN (POST /users).
// institutionId solo lo honra el backend cuando el creador es SUPER_ADMIN
// (alta cross-tenant, B.9); para el resto se infiere de TenantContext y
// mandarlo es un 400 (unexpected_institution_id).
export interface CreateUserRequest {
  fullName: string
  email: string
  password: string
  role: 'STUDENT' | 'TEACHER' | 'INSTITUTION_ADMIN'
  institutionId?: number
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
