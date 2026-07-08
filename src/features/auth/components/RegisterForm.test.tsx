import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import RegisterForm from './RegisterForm'
import { institutionsService } from '@/services/institutions.service'

vi.mock('@/services/institutions.service', () => ({
  institutionsService: {
    list: vi.fn(),
    get: vi.fn(),
  },
}))

const doRegister = vi.fn()
vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({ register: doRegister }),
  handleAuthError: vi.fn(),
}))

function renderForm(initialEntry = '/register') {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <RegisterForm />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('RegisterForm — selector de institución', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(institutionsService.list).mockResolvedValue([
      { id: 7, name: 'Sin institución' },
      { id: 1, name: 'UTEC' },
      { id: 2, name: 'PUCP' },
    ])
    vi.mocked(institutionsService.get).mockResolvedValue({
      id: 3,
      name: 'UNI',
      code: 'uni',
      active: true,
      createdAt: '2026-01-01T00:00:00Z',
    })
  })

  it('modo manual: renderiza un chip por institución con su nombre', async () => {
    renderForm()
    expect(await screen.findByRole('radio', { name: 'UTEC' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'PUCP' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Sin institución' })).toBeInTheDocument()
  })

  it('ordena "Sin institución" al final de la lista', async () => {
    renderForm()
    const chips = await screen.findAllByRole('radio')
    expect(chips[chips.length - 1]).toHaveAccessibleName('Sin institución')
  })

  it('seleccionar un chip lo marca como activo', async () => {
    renderForm()
    const chip = await screen.findByRole('radio', { name: 'UTEC' })
    await userEvent.click(chip)
    expect(chip).toBeChecked()
  })

  it('envía el institutionId del chip seleccionado al registrarse', async () => {
    doRegister.mockResolvedValue(undefined)
    renderForm()
    await userEvent.click(await screen.findByRole('radio', { name: 'PUCP' }))
    await userEvent.type(screen.getByPlaceholderText('Ana García'), 'Ana García')
    await userEvent.type(screen.getByPlaceholderText('tucorreo@universidad.edu'), 'ana@pucp.edu')
    await userEvent.type(screen.getByPlaceholderText('Mínimo 8 caracteres'), 'password123')
    await userEvent.type(screen.getByPlaceholderText('Repite tu contraseña'), 'password123')
    await userEvent.click(screen.getByRole('button', { name: /crear cuenta/i }))
    expect(doRegister).toHaveBeenCalledWith(
      expect.objectContaining({ institutionId: 2 }),
    )
  })

  it('sin institución seleccionada muestra el error del schema y no registra', async () => {
    renderForm()
    await screen.findByRole('radio', { name: 'UTEC' })
    await userEvent.type(screen.getByPlaceholderText('Ana García'), 'Ana García')
    await userEvent.type(screen.getByPlaceholderText('tucorreo@universidad.edu'), 'ana@pucp.edu')
    await userEvent.type(screen.getByPlaceholderText('Mínimo 8 caracteres'), 'password123')
    await userEvent.type(screen.getByPlaceholderText('Repite tu contraseña'), 'password123')
    await userEvent.click(screen.getByRole('button', { name: /crear cuenta/i }))
    expect(await screen.findByText('Selecciona una institución')).toBeInTheDocument()
    expect(doRegister).not.toHaveBeenCalled()
  })

  it('modo URL (?iid=): no muestra chips y fija la institución del link', async () => {
    renderForm('/register?iid=3')
    expect(await screen.findByText('UNI')).toBeInTheDocument()
    expect(screen.queryByRole('radio')).not.toBeInTheDocument()
    expect(institutionsService.list).not.toHaveBeenCalled()
  })
})
