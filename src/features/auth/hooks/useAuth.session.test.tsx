import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { useAuth } from './useAuth'
import { authService } from '@/services/auth.service'
import { progressService } from '@/services/progress.service'
import { queryClient } from '@/lib/query-client'
import { useAuthStore } from '@/store/auth.store'
import { useSessionStore } from '@/store/session.store'

const navigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    useNavigate: () => navigate,
  }
})

vi.mock('@/services/auth.service', () => ({
  authService: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  },
}))

vi.mock('@/services/progress.service', () => ({
  progressService: {
    getProgress: vi.fn(),
  },
}))

const AUTH_RESPONSE = {
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
  expiresIn: 900,
  userId: 7,
  institutionId: 3,
  email: 'student@school.edu',
  role: 'STUDENT' as const,
  xp: 25,
  emailVerified: true,
}

function wrapper({ children }: { children: React.ReactNode }) {
  return <MemoryRouter initialEntries={['/login']}>{children}</MemoryRouter>
}

describe('useAuth session flow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useAuthStore.getState().logout()
    useSessionStore.setState({ status: 'idle' })
    queryClient.clear()
  })

  it('stores the authenticated session and synchronized progress after login', async () => {
    vi.mocked(authService.login).mockResolvedValue(AUTH_RESPONSE)
    vi.mocked(progressService.getProgress).mockResolvedValue({
      xp: 40,
      currentStreak: 5,
      streakFreezes: 1,
      badges: ['first-week'],
    })

    const { result } = renderHook(() => useAuth(), { wrapper })
    await result.current.login({ email: AUTH_RESPONSE.email, password: 'Password123!' })

    expect(useAuthStore.getState()).toMatchObject({
      accessToken: 'access-token',
      refreshToken: null,
      hasSession: true,
      userId: 7,
      institutionId: 3,
      email: AUTH_RESPONSE.email,
      role: 'STUDENT',
      xp: 40,
      currentStreak: 5,
    })
    expect(useSessionStore.getState().status).toBe('ready')
    expect(navigate).toHaveBeenCalledWith('/dashboard', { replace: true })
    expect(localStorage.getItem('streakstudy-auth')).not.toContain('refresh-token')
  })

  it('keeps the login response XP when progress synchronization fails', async () => {
    vi.mocked(authService.login).mockResolvedValue(AUTH_RESPONSE)
    vi.mocked(progressService.getProgress).mockRejectedValue(new Error('network error'))

    const { result } = renderHook(() => useAuth(), { wrapper })
    await result.current.login({ email: AUTH_RESPONSE.email, password: 'Password123!' })

    expect(useAuthStore.getState().xp).toBe(25)
    expect(useSessionStore.getState().status).toBe('ready')
  })

  it('clears the local session even when the server logout request fails', async () => {
    useAuthStore.getState().setAuth(AUTH_RESPONSE)
    useSessionStore.setState({ status: 'ready' })
    vi.mocked(authService.logout).mockRejectedValue(new Error('network error'))
    const clearQueries = vi.spyOn(queryClient, 'clear')

    const { result } = renderHook(() => useAuth(), { wrapper })
    await result.current.logout()

    await waitFor(() => expect(useAuthStore.getState().refreshToken).toBeNull())
    expect(authService.logout).toHaveBeenCalledWith(undefined)
    expect(useSessionStore.getState().status).toBe('idle')
    expect(clearQueries).toHaveBeenCalledOnce()
    expect(navigate).toHaveBeenCalledWith('/login', { replace: true })
  })
})
