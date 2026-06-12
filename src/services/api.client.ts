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

// ── Request interceptor — attach access token ─────────────────────────────────
axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().accessToken
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── Response interceptor — 401 → refresh token flow ──────────────────────────
axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
    const status: number | undefined = error.response?.status
    const isRefreshEndpoint = (original.url ?? '').includes('/auth/refresh')

    if (status !== 401 || isRefreshEndpoint || original._retry) {
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

      useAuthStore.getState().setAuth({
        ...useAuthStore.getState(),
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
