import { describe, it, expect } from 'vitest'
import { axiosInstance } from '@/lib/axios'
import { notificationsService } from './notifications.service'

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

describe('notificationsService.unreadCount', () => {
  it('lee el contador desde { count } (NotificationController.unreadCount), no { unread }', async () => {
    const restore = withAdapter(async (config) => ({
      data: { count: 4 },
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    }))

    try {
      const count = await notificationsService.unreadCount()
      expect(count).toBe(4)
    } finally {
      restore()
    }
  })
})
