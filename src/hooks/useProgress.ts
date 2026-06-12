import { useQuery } from '@tanstack/react-query'
import { progressService } from '@/services/progress.service'
import { QK } from '@/lib/query-keys'

export function useProgress() {
  return useQuery({
    queryKey: QK.progress,
    queryFn: progressService.getProgress,
  })
}
