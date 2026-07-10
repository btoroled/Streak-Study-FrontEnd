import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ProfilePage from './ProfilePage'
import { useAuthStore } from '@/store/auth.store'
import type { UserRole } from '@/config/roles'

vi.mock('@/features/profile/hooks/useProfile', () => ({
  useProfile: () => ({
    fullName: 'Test User',
    email: 'test@x.com',
    role: 'STUDENT',
    xp: 0,
    currentStreak: 0,
    streakFreezes: 0,
    badges: [],
    isLoading: false,
  }),
}))

function renderAs(role: UserRole) {
  useAuthStore.getState().logout()
  useAuthStore.getState().setAuth({
    accessToken: 't',
    refreshToken: 'r',
    userId: 1,
    institutionId: 1,
    email: 'test@x.com',
    role,
    xp: 0,
    emailVerified: true,
  })
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('ProfilePage — sección de alta de usuarios', () => {
  beforeEach(() => {
    useAuthStore.getState().logout()
  })

  it('STUDENT: la sección no se renderiza y no hay redirect', () => {
    renderAs('STUDENT')
    expect(screen.queryByText(/crear usuario/i)).not.toBeInTheDocument()
    expect(screen.getByText('Mi perfil')).toBeInTheDocument()
  })

  it('TEACHER: la sección se renderiza', () => {
    renderAs('TEACHER')
    expect(screen.getByRole('button', { name: /crear usuario/i })).toBeInTheDocument()
  })

  it('INSTITUTION_ADMIN: la sección se renderiza', () => {
    renderAs('INSTITUTION_ADMIN')
    expect(screen.getByRole('button', { name: /crear usuario/i })).toBeInTheDocument()
  })
})
