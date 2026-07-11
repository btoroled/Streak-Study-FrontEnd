import type { UserRole } from '@/config/roles'

export interface RegisterRequest {
  institutionId: number
  email: string
  password: string
  fullName: string
  /** Inscribe al alumno en el curso indicado (invitación por link, Issue B.14/W7.1). */
  courseId?: number
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
  userId: number
  institutionId: number
  email: string
  role: UserRole
  xp: number
  emailVerified: boolean
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  newPassword: string
}

export interface UserMeResponse {
  userId: number
  email: string
  fullName: string
  role: UserRole
  institutionId: number
  emailVerified: boolean
}

export interface VerifyEmailRequest {
  code: string
}
