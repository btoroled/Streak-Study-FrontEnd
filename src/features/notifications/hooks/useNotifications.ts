import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { notificationsService } from '@/services/notifications.service'
import { QK } from '@/lib/query-keys'

export function useUnreadCount() {
  return useQuery({
    queryKey: QK.notificationsUnread,
    queryFn: notificationsService.unreadCount,
    refetchInterval: 60_000, // sondeo cada minuto
  })
}

export function useNotifications(enabled: boolean) {
  const qc = useQueryClient()

  const list = useQuery({
    queryKey: QK.notifications,
    queryFn: () => notificationsService.list(),
    enabled, // solo carga al abrir el dropdown
  })

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: QK.notifications })
    qc.invalidateQueries({ queryKey: QK.notificationsUnread })
  }

  const markRead = useMutation({
    mutationFn: (id: number) => notificationsService.markRead(id),
    onSuccess: invalidate,
  })

  const markAllRead = useMutation({
    mutationFn: () => notificationsService.markAllRead(),
    onSuccess: invalidate,
  })

  return { list, markRead, markAllRead }
}
