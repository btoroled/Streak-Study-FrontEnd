import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AdminPage from './AdminPage'
import { adminService } from '@/services/admin.service'
import { useAuthStore } from '@/store/auth.store'

vi.mock('@/services/admin.service', () => ({
  adminService: {
    stats: vi.fn(),
    institutionStats: vi.fn(),
  },
}))

vi.mock('@/services/institutions.service', () => ({
  institutionsService: { list: vi.fn().mockResolvedValue([]) },
}))

vi.mock('@/services/users.service', () => ({
  usersService: { create: vi.fn() },
}))

function renderPage() {
  useAuthStore.getState().logout()
  useAuthStore.getState().setAuth({
    accessToken: 't',
    refreshToken: 'r',
    userId: 1,
    institutionId: 1,
    email: 'root@x.com',
    role: 'SUPER_ADMIN',
    xp: 0,
  })
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('AdminPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(adminService.stats).mockResolvedValue({
      totalUsers: 120,
      activeUsers: 45,
      totalInstitutions: 3,
      totalDecks: 87,
      totalFlashcards: 950,
      totalReviews: 4321,
      aiTokensUsed: 123456,
      usersByRole: { STUDENT: 100, TEACHER: 15, INSTITUTION_ADMIN: 4, SUPER_ADMIN: 1 },
    })
    vi.mocked(adminService.institutionStats).mockResolvedValue([
      { institutionId: 1, name: 'UTEC', users: 80, decks: 60, reviews: 3000 },
      { institutionId: 2, name: 'Sin institución', users: 40, decks: 27, reviews: 1321 },
    ])
  })

  it('muestra los KPIs de plataforma', async () => {
    renderPage()
    expect(await screen.findByText('120')).toBeInTheDocument()
    expect(screen.getByText('45')).toBeInTheDocument()
    expect(screen.getByText(/usuarios activos/i)).toBeInTheDocument()
    expect(screen.getByText(/tokens de ia/i)).toBeInTheDocument()
  })

  it('muestra el desglose por institución', async () => {
    renderPage()
    expect(await screen.findByText('UTEC')).toBeInTheDocument()
    expect(screen.getByText('Sin institución')).toBeInTheDocument()
  })

  it('incluye la sección de alta de usuarios (cross-tenant para SUPER_ADMIN)', async () => {
    renderPage()
    expect(await screen.findByRole('button', { name: /crear usuario/i })).toBeInTheDocument()
  })
})
