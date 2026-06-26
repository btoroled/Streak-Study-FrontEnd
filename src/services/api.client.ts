import { axiosInstance } from '@/lib/axios'
import { useAuthStore } from '@/store/auth.store'
import { queryClient } from '@/lib/query-client'
import type { InternalAxiosRequestConfig } from 'axios'

// ── Refresh mutex ─────────────────────────────────────────────────────────────
let isRefreshing = false
let pendingQueue: Array<{
  resolve: (token: string) => void
  reject: (err: unknown) => void
}> = []

function flushQueue(error: unknown, token: string | null) {
  pendingQueue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve(token!)
  )
  pendingQueue = []
}

// Auth endpoints that should never receive the access token in the request
const UNAUTHENTICATED_PATHS = ['/auth/login', '/auth/register', '/auth/refresh']

// ── Request interceptor — attach access token ─────────────────────────────────
axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const url = config.url ?? ''
  const isPublicAuthPath = UNAUTHENTICATED_PATHS.some((p) => url.includes(p))
  const token = useAuthStore.getState().accessToken
  if (token && config.headers && !isPublicAuthPath) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── Response interceptor — 401 → refresh token flow ──────────────────────────
axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined

    // Errores de red / timeout sin request configurado: no hay nada que reintentar.
    if (!original) return Promise.reject(error)

    const status: number | undefined = error.response?.status
    const url = original.url ?? ''
    const isRefreshEndpoint = url.includes('/auth/refresh')
    // Auth endpoints that handle their own 401 (invalid credentials, etc.)
    const isUnauthenticatedEndpoint = url.includes('/auth/login') || url.includes('/auth/register')

    if (status !== 401 || isRefreshEndpoint || isUnauthenticatedEndpoint || original._retry) {
      return Promise.reject(error)
    }

    original._retry = true

    // Another refresh is already in flight — queue this request
    if (isRefreshing) {
      return new Promise<unknown>((resolve, reject) => {
        pendingQueue.push({
          resolve: (token) => {
            original.headers!.Authorization = `Bearer ${token}`
            resolve(axiosInstance(original))
          },
          reject,
        })
      })
    }

    isRefreshing = true

    try {
      const { refreshToken } = useAuthStore.getState()
      if (!refreshToken) throw new Error('No refresh token available')

      const { data } = await axiosInstance.post('/auth/refresh', { refreshToken })

      useAuthStore.getState().setTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        xp: data.xp,
      })

      original.headers!.Authorization = `Bearer ${data.accessToken}`
      flushQueue(null, data.accessToken)

      return axiosInstance(original)
    } catch (refreshError) {
      flushQueue(refreshError, null)
      useAuthStore.getState().logout()
      queryClient.clear()
      window.location.replace('/login?session=expired')
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)

export default axiosInstance
