import api from './api.client'
import type { NotificationResponse } from '@/types/notification.types'
import type { PageResponse } from '@/types/api.types'

const BASE = '/users/me/notifications'

export const notificationsService = {
  /** Notificaciones del usuario, paginadas (20 por página, más recientes primero). */
  list: (page = 0) =>
    api.get<PageResponse<NotificationResponse>>(BASE, { params: { page } }).then(r => r.data),
  unreadCount: () =>
    api.get<{ unread: number }>(`${BASE}/unread-count`).then(r => r.data.unread),
  markRead: (id: number) =>
    api.patch(`${BASE}/${id}/read`),
  markAllRead: () =>
    api.patch(`${BASE}/read-all`),
}
