import api from './api.client'
import type { LoginRequest, RegisterRequest, AuthResponse, ForgotPasswordRequest, ResetPasswordRequest, RefreshTokenRequest, UserMeResponse, VerifyEmailRequest } from '@/types/auth.types'

export const authService = {
  login: (data: LoginRequest) =>
    api.post<AuthResponse>('/auth/login', data).then(r => r.data),

  register: (data: RegisterRequest) =>
    api.post<AuthResponse>('/auth/register', data).then(r => r.data),

  refresh: (data?: RefreshTokenRequest) =>
    api.post<AuthResponse>('/auth/refresh', data).then(r => r.data),

  me: () =>
    api.get<UserMeResponse>('/auth/me').then(r => r.data),

  logout: (data?: RefreshTokenRequest) =>
    api.post('/auth/logout', data),

  forgotPassword: (data: ForgotPasswordRequest) =>
    api.post('/auth/password/forgot', data),

  resetPassword: (data: ResetPasswordRequest) =>
    api.post('/auth/password/reset', data),

  resendVerification: () =>
    api.post('/auth/verify/resend'),

  confirmVerification: (data: VerifyEmailRequest) =>
    api.post('/auth/verify/confirm', data),
}
