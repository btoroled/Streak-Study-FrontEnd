import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { axiosInstance } from '@/lib/axios'
import { useAuthStore } from '@/store/auth.store'
import './api.client' // attach interceptors

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

const AUTH_PAYLOAD = {
  accessToken: 'old-access',
  refreshToken: 'good-refresh',
  userId: 1,
  institutionId: 1,
  email: 'x@y.com',
  role: 'STUDENT' as const,
  xp: 0,
  emailVerified: true,
}

beforeEach(() => {
  useAuthStore.getState().logout()
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('api.client — refresh interceptor', () => {
  it('reintenta el request original con el nuevo access token tras 401', async () => {
    useAuthStore.getState().setAuth(AUTH_PAYLOAD)

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
      return { data: { ok: true }, status: 200, statusText: 'OK', headers: {}, config }
    })

    try {
      const res = await axiosInstance.get('/protected')
      expect(res.data).toEqual({ ok: true })
      expect(useAuthStore.getState().accessToken).toBe('new-access')
      expect(useAuthStore.getState().refreshToken).toBe('new-refresh')
      const protectedCalls = calls.filter((c) => c.url === '/protected')
      expect(protectedCalls).toHaveLength(2)
      expect(protectedCalls[1].auth).toBe('Bearer new-access')
    } finally {
      restore()
    }
  })

  it('encola requests concurrentes durante un refresh — un solo /auth/refresh', async () => {
    useAuthStore.getState().setAuth(AUTH_PAYLOAD)

    let refreshCount = 0
    const protectedAttempts = new Map<string, number>()
    let resolveRefresh: (() => void) | null = null
    const refreshGate = new Promise<void>((r) => { resolveRefresh = r })

    const restore = withAdapter(async (config) => {
      const url = config.url ?? ''

      if (url === '/auth/refresh') {
        refreshCount += 1
        await refreshGate
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
      await new Promise((r) => setTimeout(r, 10))
      resolveRefresh!()
      const [r1, r2] = await Promise.all([p1, p2])
      expect(r1.data).toEqual({ url: '/a', n: 2 })
      expect(r2.data).toEqual({ url: '/b', n: 2 })
      expect(refreshCount).toBe(1)
    } finally {
      restore()
    }
  })

  it('no reintenta cuando el endpoint es /auth/login (401 = credenciales malas)', async () => {
    useAuthStore.getState().setAuth(AUTH_PAYLOAD)

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
      expect(calls).toBe(1)
    } finally {
      restore()
    }
  })

  it('no adjunta Authorization a /auth/refresh', async () => {
    useAuthStore.getState().setAuth(AUTH_PAYLOAD)

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

  it('hace logout y redirige a /login?session=expired cuando el refresh falla', async () => {
    vi.stubGlobal('location', { replace: vi.fn() })
    useAuthStore.getState().setAuth(AUTH_PAYLOAD)

    const restore = withAdapter(async (config) => {
      return Promise.reject({
        isAxiosError: true,
        config,
        response: { status: 401, data: {}, statusText: '', headers: {}, config },
      })
    })

    try {
      await expect(axiosInstance.get('/protected')).rejects.toBeDefined()
      expect(useAuthStore.getState().refreshToken).toBeNull()
      expect(window.location.replace).toHaveBeenCalledWith('/login?session=expired')
    } finally {
      restore()
    }
  })

  it('no inicia un nuevo refresh si el retry del request vuelve a fallar con 401', async () => {
    useAuthStore.getState().setAuth(AUTH_PAYLOAD)

    let refreshCount = 0
    const restore = withAdapter(async (config) => {
      const url = config.url ?? ''
      if (url === '/auth/refresh') {
        refreshCount++
        return {
          data: { accessToken: 'at2', refreshToken: 'rt2', xp: 0 },
          status: 200, statusText: 'OK', headers: {}, config,
        }
      }
      return Promise.reject({
        isAxiosError: true, config,
        response: { status: 401, data: {}, statusText: '', headers: {}, config },
      })
    })

    try {
      await expect(axiosInstance.get('/protected')).rejects.toMatchObject({ response: { status: 401 } })
      expect(refreshCount).toBe(1)
    } finally {
      restore()
    }
  })

  it('propaga errores que no son 401 sin intentar refresh', async () => {
    useAuthStore.getState().setAuth(AUTH_PAYLOAD)

    let refreshCalled = false
    const restore = withAdapter(async (config) => {
      if ((config.url ?? '').includes('/auth/refresh')) refreshCalled = true
      return Promise.reject({
        isAxiosError: true, config,
        response: { status: 500, data: {}, statusText: '', headers: {}, config },
      })
    })

    try {
      await expect(axiosInstance.get('/protected')).rejects.toMatchObject({ response: { status: 500 } })
      expect(refreshCalled).toBe(false)
    } finally {
      restore()
    }
  })
})
