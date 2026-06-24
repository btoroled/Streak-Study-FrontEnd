import { useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuthStore } from '@/store/auth.store'
import { useSessionStore } from '@/store/session.store'
import { authService } from '@/services/auth.service'
import { progressService } from '@/services/progress.service'
import { queryClient } from '@/lib/query-client'
import { getErrorCode, getErrorMessage } from '@/lib/error.utils'
import type { LoginFormValues, RegisterFormValues } from '../schemas/auth.schemas'

export function useAuth() {
  const navigate = useNavigate()
  const location = useLocation()

  const login = useCallback(
    async (data: LoginFormValues) => {
      const authData = await authService.login(data)

      useAuthStore.getState().setAuth({
        accessToken: authData.accessToken,
        refreshToken: authData.refreshToken,
        userId: authData.userId,
        institutionId: authData.institutionId,
        email: authData.email,
        role: authData.role,
        xp: authData.xp,
      })

      try {
        const progress = await progressService.getProgress()
        useAuthStore.getState().setProgress(progress)
      } catch { /* use xp from AuthResponse as fallback */ }
      useSessionStore.getState().setStatus('ready')

      const params = new URLSearchParams(location.search)
      const redirectTo = params.get('redirect') ?? '/dashboard'
      navigate(redirectTo, { replace: true })
    },
    [navigate, location.search]
  )

  const register = useCallback(
    async (data: RegisterFormValues) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword: _cp, ...registerData } = data

      const authData = await authService.register(registerData)

      useAuthStore.getState().setAuth({
        accessToken: authData.accessToken,
        refreshToken: authData.refreshToken,
        userId: authData.userId,
        institutionId: authData.institutionId,
        email: authData.email,
        fullName: data.fullName,
        role: authData.role,
        xp: authData.xp,
      })

      try {
        const progress = await progressService.getProgress()
        useAuthStore.getState().setProgress(progress)
      } catch { /* use xp from AuthResponse as fallback */ }
      useSessionStore.getState().setStatus('ready')

      navigate('/dashboard', { replace: true })
    },
    [navigate]
  )

  const logout = useCallback(async () => {
    const { refreshToken } = useAuthStore.getState()
    if (refreshToken) {
      try {
        await authService.logout({ refreshToken })
      } catch {
        // Local cleanup always proceeds even if the request fails
      }
    }
    useAuthStore.getState().logout()
    useSessionStore.getState().setStatus('idle')
    queryClient.clear()
    navigate('/login', { replace: true })
  }, [navigate])

  // Called once by AuthGuard on startup to hydrate accessToken + progress
  const initSession = useCallback(async () => {
    const { refreshToken } = useAuthStore.getState()
    if (!refreshToken) throw new Error('No session')

    const authData = await authService.refresh({ refreshToken })

    useAuthStore.getState().setTokens({
      accessToken: authData.accessToken,
      refreshToken: authData.refreshToken,
      xp: authData.xp,
    })

    try {
      const progress = await progressService.getProgress()
      useAuthStore.getState().setProgress(progress)
    } catch { /* non-fatal */ }
  }, [])

  return { login, register, logout, initSession }
}

export function handleAuthError(
  error: unknown,
  setFieldError?: (field: string, msg: string) => void
) {
  const code = getErrorCode(error)

  switch (code) {
    case 'invalid_credentials':
      toast.error('Email o contraseña incorrectos')
      break
    case 'email_already_exists':
      setFieldError?.('email', 'Este email ya está registrado')
      break
    case 'validation_error': {
      const apiErr = (
        error as {
          response?: { data?: { errors?: Array<{ field: string; message: string }> } }
        }
      )?.response?.data
      if (apiErr?.errors?.length) {
        apiErr.errors.forEach(({ field, message }) => setFieldError?.(field, message))
      } else {
        toast.error(getErrorMessage(error))
      }
      break
    }
    case 'too_many_requests':
      toast.error('Demasiados intentos. Espera un momento e intenta de nuevo.')
      break
    default:
      toast.error(getErrorMessage(error))
  }
}
