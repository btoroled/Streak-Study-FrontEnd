import api from './api.client'
import type { NotificationResponse } from '@/types/notification.types'

const BASE = '/notifications'

export const notificationsService = {
  /** Notificaciones del usuario (hasta 30, más recientes primero). */
  list: () =>
    api.get<NotificationResponse[]>(BASE).then(r => r.data),
  unreadCount: () =>
    api.get<{ unread: number }>(`${BASE}/unread-count`).then(r => r.data.unread),
  markRead: (id: number) =>
    api.post(`${BASE}/${id}/read`),
  markAllRead: () =>
    api.post(`${BASE}/read-all`),
}
