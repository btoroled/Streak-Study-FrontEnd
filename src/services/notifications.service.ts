import api from './api.client'
import type { NotificationResponse } from '@/types/notification.types'

const BASE = '/notifications'

export const notificationsService = {
  /** Notificaciones del usuario (hasta 30, más recientes primero). */
  list: () =>
    api.get<NotificationResponse[]>(BASE).then(r => r.data),
  // El backend devuelve { count: N } (NotificationController.unreadCount), no { unread: N }.
  unreadCount: () =>
    api.get<{ count: number }>(`${BASE}/unread-count`).then(r => r.data.count),
  markRead: (id: number) =>
    api.post(`${BASE}/${id}/read`),
  markAllRead: () =>
    api.post(`${BASE}/read-all`),
}
