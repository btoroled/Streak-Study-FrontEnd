import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { SessionInitProvider } from './SessionInitProvider'
import { useAuthStore } from '@/store/auth.store'
import { useSessionStore } from '@/store/session.store'
import { authService } from '@/services/auth.service'
import { progressService } from '@/services/progress.service'

vi.mock('@/services/auth.service', () => ({
  authService: {
    refresh: vi.fn(),
    me: vi.fn(),
  },
}))
vi.mock('@/services/progress.service', () => ({
  progressService: {
    getProgress: vi.fn(),
  },
}))

describe('SessionInitProvider', () => {
  beforeEach(() => {
    useAuthStore.getState().logout()
    useAuthStore.setState({ refreshToken: 'stored-refresh-token' })
    useSessionStore.setState({ status: 'idle' })
    vi.clearAllMocks()
  })

  it('llega a status "ready" tras un refresh exitoso (regresión: el efecto no debe cancelarse a sí mismo)', async () => {
    vi.mocked(authService.refresh).mockResolvedValue({
      accessToken: 'access', refreshToken: 'new-refresh', expiresIn: 900,
      userId: 1, institutionId: 1, email: 'a@a.com', role: 'TEACHER', xp: 10, emailVerified: true,
    })
    vi.mocked(authService.me).mockResolvedValue({
      userId: 1, email: 'a@a.com', fullName: 'Ana', role: 'TEACHER', institutionId: 1, emailVerified: true,
    })
    vi.mocked(progressService.getProgress).mockResolvedValue({
      xp: 10, currentStreak: 2, streakFreezes: 0, badges: [],
    })

    render(<SessionInitProvider><div>app</div></SessionInitProvider>)

    await waitFor(() => expect(useSessionStore.getState().status).toBe('ready'))
    expect(useAuthStore.getState().role).toBe('TEACHER')
  })

  it('refresh inválido → status "error" y logout', async () => {
    vi.mocked(authService.refresh).mockRejectedValue(new Error('invalid refresh token'))

    render(<SessionInitProvider><div>app</div></SessionInitProvider>)

    await waitFor(() => expect(useSessionStore.getState().status).toBe('error'))
    expect(useAuthStore.getState().refreshToken).toBeNull()
  })
})
