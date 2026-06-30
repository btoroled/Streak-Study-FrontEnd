import api from './api.client'
import type { NotificationResponse } from '@/types/notification.types'

const BASE = '/users/me/notifications'

export const notificationsService = {
  /** Notificaciones del usuario (hasta 30, más recientes primero). */
  list: () =>
    api.get<NotificationResponse[]>(BASE).then(r => r.data),
  unreadCount: () =>
    api.get<{ unread: number }>(`${BASE}/unread-count`).then(r => r.data.unread),
  markRead: (id: number) =>
    api.patch(`${BASE}/${id}/read`),
  markAllRead: () =>
    api.patch(`${BASE}/read-all`),
}
