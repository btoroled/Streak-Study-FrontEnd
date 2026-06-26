import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { axiosInstance } from '@/lib/axios'
import { useAuthStore } from '@/store/auth.store'
import './api.client' // attach interceptors

/**
 * Tests del interceptor de respuesta — el activo más crítico del repo.
 * Se mockea axiosInstance.request a nivel de adapter para simular respuestas
 * sin red real. El interceptor original se preserva.
 */

type Adapter = (config: import('axios').InternalAxiosRequestConfig) => Promise<{
  data: unknown
  status: number
  statusText: string
  headers: Record<string, string>
  config: import('axios').InternalAxiosRequestConfig
  request?: unknown
}>

function withAdapter(adapter: Adapter) {
  const previous = axiosInstance.defaults.adapter
  axiosInstance.defaults.adapter = adapter as never
  return () => {
    axiosInstance.defaults.adapter = previous
  }
}

beforeEach(() => {
  useAuthStore.getState().logout()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('api.client — refresh interceptor', () => {
  it('reintenta el request original con el nuevo access token tras 401', async () => {
    useAuthStore.getState().setAuth({
      accessToken: 'old-access',
      refreshToken: 'good-refresh',
      userId: 1,
      institutionId: 1,
      email: 'x@y.com',
      role: 'STUDENT',
      xp: 0,
    })

    const calls: Array<{ url?: string; auth?: string }> = []
    const restore = withAdapter(async (config) => {
      const url = config.url
      calls.push({ url, auth: config.headers?.Authorization as string | undefined })

      if (url === '/protected' && calls.filter((c) => c.url === '/protected').length === 1) {
        return Promise.reject({
          isAxiosError: true,
          config,
          response: { status: 401, data: {}, statusText: '', headers: {}, config },
        })
      }
      if (url === '/auth/refresh') {
        return {
          data: { accessToken: 'new-access', refreshToken: 'new-refresh', xp: 10 },
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        }
      }
      // segundo intento de /protected
      return {
        data: { ok: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      }
    })

    try {
      const res = await axiosInstance.get('/protected')
      expect(res.data).toEqual({ ok: true })

      // El access token rotó en el store
      expect(useAuthStore.getState().accessToken).toBe('new-access')
      expect(useAuthStore.getState().refreshToken).toBe('new-refresh')

      // El retry llevó el nuevo token
      const protectedCalls = calls.filter((c) => c.url === '/protected')
      expect(protectedCalls).toHaveLength(2)
      expect(protectedCalls[1].auth).toBe('Bearer new-access')
    } finally {
      restore()
    }
  })

  it('encola requests concurrentes durante un refresh — un solo /auth/refresh', async () => {
    useAuthStore.getState().setAuth({
      accessToken: 'old',
      refreshToken: 'r',
      userId: 1,
      institutionId: 1,
      email: 'x@y.com',
      role: 'STUDENT',
      xp: 0,
    })

    let refreshCount = 0
    const protectedAttempts = new Map<string, number>()
    let resolveRefresh: (() => void) | null = null
    const refreshGate = new Promise<void>((r) => { resolveRefresh = r })

    const restore = withAdapter(async (config) => {
      const url = config.url ?? ''

      if (url === '/auth/refresh') {
        refreshCount += 1
        await refreshGate // pausa el refresh hasta que ambos requests estén encolados
        return {
          data: { accessToken: 'fresh', refreshToken: 'fresh-r', xp: 1 },
          status: 200, statusText: 'OK', headers: {}, config,
        }
      }

      const n = (protectedAttempts.get(url) ?? 0) + 1
      protectedAttempts.set(url, n)

      if (n === 1) {
        return Promise.reject({
          isAxiosError: true,
          config,
          response: { status: 401, data: {}, statusText: '', headers: {}, config },
        })
      }
      return { data: { url, n }, status: 200, statusText: 'OK', headers: {}, config }
    })

    try {
      const p1 = axiosInstance.get('/a')
      const p2 = axiosInstance.get('/b')

      // Da un tick para que ambos primer-intento + refresh queueado se registren
      await new Promise((r) => setTimeout(r, 10))
      resolveRefresh!()

      const [r1, r2] = await Promise.all([p1, p2])
      expect(r1.data).toEqual({ url: '/a', n: 2 })
      expect(r2.data).toEqual({ url: '/b', n: 2 })

      // Hubo un solo refresh aunque dos requests fallaron en paralelo
      expect(refreshCount).toBe(1)
    } finally {
      restore()
    }
  })

  it('no reintenta cuando el endpoint es /auth/login (401 = credenciales malas)', async () => {
    useAuthStore.getState().setAuth({
      accessToken: 'a',
      refreshToken: 'r',
      userId: 1,
      institutionId: 1,
      email: 'x@y.com',
      role: 'STUDENT',
      xp: 0,
    })

    let calls = 0
    const restore = withAdapter(async (config) => {
      calls += 1
      return Promise.reject({
        isAxiosError: true,
        config,
        response: { status: 401, data: { error: 'invalid_credentials' }, statusText: '', headers: {}, config },
      })
    })

    try {
      await expect(axiosInstance.post('/auth/login', {})).rejects.toMatchObject({
        response: { status: 401 },
      })
      expect(calls).toBe(1) // no retry
    } finally {
      restore()
    }
  })

  it('no adjunta Authorization a /auth/refresh', async () => {
    useAuthStore.getState().setAuth({
      accessToken: 'token-x',
      refreshToken: 'r',
      userId: 1,
      institutionId: 1,
      email: 'x@y.com',
      role: 'STUDENT',
      xp: 0,
    })

    let seenAuth: string | undefined
    const restore = withAdapter(async (config) => {
      seenAuth = config.headers?.Authorization as string | undefined
      return {
        data: { accessToken: 'a', refreshToken: 'r', xp: 0 },
        status: 200, statusText: 'OK', headers: {}, config,
      }
    })

    try {
      await axiosInstance.post('/auth/refresh', { refreshToken: 'r' })
      expect(seenAuth).toBeUndefined()
    } finally {
      restore()
    }
  })
})
