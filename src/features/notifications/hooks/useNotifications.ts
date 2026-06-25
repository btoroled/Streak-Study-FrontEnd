import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
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

  const query = useInfiniteQuery({
    queryKey: QK.notifications,
    queryFn: ({ pageParam }) => notificationsService.list(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.page + 1 : undefined),
    enabled, // solo carga al abrir el dropdown
  })

  const items = query.data?.pages.flatMap((p) => p.content) ?? []

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

  return {
    items,
    isLoading: query.isLoading,
    isFetchingMore: query.isFetchingNextPage,
    hasMore: query.hasNextPage,
    loadMore: query.fetchNextPage,
    markRead,
    markAllRead,
  }
}
