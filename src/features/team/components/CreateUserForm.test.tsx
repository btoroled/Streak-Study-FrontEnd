import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AxiosError, AxiosHeaders } from 'axios'
import CreateUserForm from './CreateUserForm'
import { usersService } from '@/services/users.service'
import { institutionsService } from '@/services/institutions.service'
import { useAuthStore } from '@/store/auth.store'
import { toast } from 'sonner'
import type { UserRole } from '@/config/roles'

vi.mock('@/services/users.service', () => ({
  usersService: { create: vi.fn() },
}))

vi.mock('@/services/institutions.service', () => ({
  institutionsService: { list: vi.fn() },
}))

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

function apiError(status: number, code: string): AxiosError {
  const config = { headers: new AxiosHeaders() }
  return new AxiosError('request failed', String(status), config, {}, {
    status,
    statusText: '',
    headers: {},
    config,
    data: { error: code, message: 'boom' },
  })
}

function renderAs(role: UserRole) {
  useAuthStore.getState().logout()
  useAuthStore.getState().setAuth({
    accessToken: 't',
    refreshToken: 'r',
    userId: 1,
    institutionId: 1,
    email: 'creator@x.com',
    role,
    xp: 0,
  })
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <CreateUserForm />
    </QueryClientProvider>,
  )
}

async function fillAndSubmit() {
  await userEvent.type(screen.getByLabelText(/nombre completo/i), 'Nuevo Usuario')
  await userEvent.type(screen.getByLabelText(/email/i), 'nuevo@x.com')
  await userEvent.type(screen.getByLabelText(/contraseña inicial/i), 'password123')
  await userEvent.click(screen.getByRole('button', { name: /crear usuario/i }))
}

describe('CreateUserForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(institutionsService.list).mockResolvedValue([
      { id: 1, name: 'UTEC' },
      { id: 2, name: 'PUCP' },
    ])
  })

  it('TEACHER: el select de rol solo ofrece STUDENT y está deshabilitado', () => {
    renderAs('TEACHER')
    const select = screen.getByLabelText<HTMLSelectElement>(/rol/i)
    expect(select).toBeDisabled()
    const options = Array.from(select.options).map((o) => o.value)
    expect(options).toEqual(['STUDENT'])
  })

  it('INSTITUTION_ADMIN: el select ofrece STUDENT y TEACHER, habilitado', () => {
    renderAs('INSTITUTION_ADMIN')
    const select = screen.getByLabelText<HTMLSelectElement>(/rol/i)
    expect(select).toBeEnabled()
    const options = Array.from(select.options).map((o) => o.value)
    expect(options).toEqual(['STUDENT', 'TEACHER'])
  })

  it('submit válido llama al servicio con el payload y muestra toast de éxito', async () => {
    vi.mocked(usersService.create).mockResolvedValue({
      userId: 9,
      institutionId: 1,
      email: 'nuevo@x.com',
      fullName: 'Nuevo Usuario',
      role: 'STUDENT',
    })
    renderAs('TEACHER')
    await fillAndSubmit()
    expect(vi.mocked(usersService.create).mock.calls[0][0]).toEqual({
      fullName: 'Nuevo Usuario',
      email: 'nuevo@x.com',
      password: 'password123',
      role: 'STUDENT',
    })
    expect(toast.success).toHaveBeenCalled()
  })

  it('INSTITUTION_ADMIN puede elegir TEACHER y se envía ese rol', async () => {
    vi.mocked(usersService.create).mockResolvedValue({
      userId: 9,
      institutionId: 1,
      email: 'nuevo@x.com',
      fullName: 'Nuevo Usuario',
      role: 'TEACHER',
    })
    renderAs('INSTITUTION_ADMIN')
    await userEvent.selectOptions(screen.getByLabelText(/rol/i), 'TEACHER')
    await fillAndSubmit()
    expect(vi.mocked(usersService.create).mock.calls[0][0]).toMatchObject({
      role: 'TEACHER',
    })
  })

  it('email duplicado → error en el campo email, sin toast genérico', async () => {
    vi.mocked(usersService.create).mockRejectedValue(apiError(409, 'email_already_exists'))
    renderAs('TEACHER')
    await fillAndSubmit()
    expect(await screen.findByText('Este email ya está registrado')).toBeInTheDocument()
    expect(toast.error).not.toHaveBeenCalled()
  })

  it('invalid_role_assignment → toast de error', async () => {
    vi.mocked(usersService.create).mockRejectedValue(apiError(403, 'invalid_role_assignment'))
    renderAs('TEACHER')
    await fillAndSubmit()
    expect(toast.error).toHaveBeenCalled()
  })

  it('SUPER_ADMIN: el select ofrece STUDENT, TEACHER e INSTITUTION_ADMIN', () => {
    renderAs('SUPER_ADMIN')
    const select = screen.getByLabelText<HTMLSelectElement>(/^rol/i)
    expect(select).toBeEnabled()
    const options = Array.from(select.options).map((o) => o.value)
    expect(options).toEqual(['STUDENT', 'TEACHER', 'INSTITUTION_ADMIN'])
  })

  it('SUPER_ADMIN: muestra selector de institución y envía institutionId (B.9)', async () => {
    vi.mocked(usersService.create).mockResolvedValue({
      userId: 9,
      institutionId: 2,
      email: 'nuevo@x.com',
      fullName: 'Nuevo Usuario',
      role: 'INSTITUTION_ADMIN',
    })
    renderAs('SUPER_ADMIN')
    await userEvent.selectOptions(screen.getByLabelText(/^rol/i), 'INSTITUTION_ADMIN')
    await userEvent.selectOptions(await screen.findByLabelText(/institución/i), '2')
    await fillAndSubmit()
    expect(vi.mocked(usersService.create).mock.calls[0][0]).toEqual({
      fullName: 'Nuevo Usuario',
      email: 'nuevo@x.com',
      password: 'password123',
      role: 'INSTITUTION_ADMIN',
      institutionId: 2,
    })
  })

  it('SUPER_ADMIN: sin institución elegida muestra error local y no llama al servicio', async () => {
    renderAs('SUPER_ADMIN')
    await fillAndSubmit()
    expect(await screen.findByText('Selecciona una institución')).toBeInTheDocument()
    expect(usersService.create).not.toHaveBeenCalled()
  })

  it('TEACHER: no muestra selector de institución y el payload no incluye institutionId', async () => {
    vi.mocked(usersService.create).mockResolvedValue({
      userId: 9,
      institutionId: 1,
      email: 'nuevo@x.com',
      fullName: 'Nuevo Usuario',
      role: 'STUDENT',
    })
    renderAs('TEACHER')
    expect(screen.queryByLabelText(/institución/i)).not.toBeInTheDocument()
    await fillAndSubmit()
    expect(vi.mocked(usersService.create).mock.calls[0][0]).not.toHaveProperty('institutionId')
  })

  it('validación local: password corta no llama al servicio', async () => {
    renderAs('TEACHER')
    await userEvent.type(screen.getByLabelText(/nombre completo/i), 'Nuevo Usuario')
    await userEvent.type(screen.getByLabelText(/email/i), 'nuevo@x.com')
    await userEvent.type(screen.getByLabelText(/contraseña inicial/i), 'corta')
    await userEvent.click(screen.getByRole('button', { name: /crear usuario/i }))
    expect(await screen.findByText('Mínimo 8 caracteres')).toBeInTheDocument()
    expect(usersService.create).not.toHaveBeenCalled()
  })
})
