import { describe, it, expect, vi, beforeEach } from 'vitest'
import { toast } from 'sonner'
import { handleAuthError } from './useAuth'

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}))

function makeAxiosError(code: string, fields?: Array<{ field: string; message: string }>) {
  return {
    isAxiosError: true,
    response: {
      data: {
        error: code,
        message: `mensaje del backend para ${code}`,
        ...(fields ? { errors: fields } : {}),
      },
    },
  }
}

// Hacer que axios.isAxiosError() devuelva true para los objetos planos del test
vi.mock('axios', async () => {
  const actual = await vi.importActual<typeof import('axios')>('axios')
  return {
    ...actual,
    default: {
      ...actual.default,
      isAxiosError: (e: unknown) => !!(e as { isAxiosError?: boolean })?.isAxiosError,
    },
    isAxiosError: (e: unknown) => !!(e as { isAxiosError?: boolean })?.isAxiosError,
  }
})

describe('handleAuthError', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('invalid_credentials → toast genérico, no toca campos', () => {
    const setField = vi.fn()
    handleAuthError(makeAxiosError('invalid_credentials'), setField)

    expect(toast.error).toHaveBeenCalledWith('Email o contraseña incorrectos')
    expect(setField).not.toHaveBeenCalled()
  })

  it('email_already_exists → setError en campo email, no toast', () => {
    const setField = vi.fn()
    handleAuthError(makeAxiosError('email_already_exists'), setField)

    expect(setField).toHaveBeenCalledWith('email', 'Este email ya está registrado')
    expect(toast.error).not.toHaveBeenCalled()
  })

  it('validation_error con errors[] → setError por cada campo', () => {
    const setField = vi.fn()
    handleAuthError(
      makeAxiosError('validation_error', [
        { field: 'email', message: 'Email inválido' },
        { field: 'password', message: 'Muy corta' },
      ]),
      setField,
    )

    expect(setField).toHaveBeenCalledTimes(2)
    expect(setField).toHaveBeenCalledWith('email', 'Email inválido')
    expect(setField).toHaveBeenCalledWith('password', 'Muy corta')
    expect(toast.error).not.toHaveBeenCalled()
  })

  it('validation_error sin errors[] → fallback a toast', () => {
    const setField = vi.fn()
    handleAuthError(makeAxiosError('validation_error'), setField)

    expect(toast.error).toHaveBeenCalledWith('mensaje del backend para validation_error')
    expect(setField).not.toHaveBeenCalled()
  })

  it('too_many_requests → toast informativo', () => {
    handleAuthError(makeAxiosError('too_many_requests'))

    expect(toast.error).toHaveBeenCalledWith(
      'Demasiados intentos. Espera un momento e intenta de nuevo.',
    )
  })

  it('código desconocido → toast con mensaje del backend', () => {
    handleAuthError(makeAxiosError('algo_raro'))

    expect(toast.error).toHaveBeenCalledWith('mensaje del backend para algo_raro')
  })

  it('error sin shape de axios → toast con fallback genérico', () => {
    handleAuthError(new Error('boom'))

    expect(toast.error).toHaveBeenCalledWith('Algo salió mal, intenta de nuevo.')
  })
})
