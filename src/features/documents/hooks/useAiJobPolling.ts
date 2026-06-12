import { useQuery, useQueryClient } from '@tanstack/react-query'
import { documentsService } from '@/services/documents.service'
import { QK } from '@/lib/query-keys'

export function useAiJobPolling(jobId: number | null) {
  const qc = useQueryClient()

  return useQuery({
    queryKey: QK.aiJob(jobId ?? 0),
    queryFn: () => documentsService.getJob(jobId!),
    enabled: jobId !== null && jobId > 0,
    refetchInterval: (query) => {
      const status = query.state.data?.status
      if (status === 'COMPLETED') {
        qc.invalidateQueries({ queryKey: QK.decks })
        return false
      }
      if (status === 'FAILED') return false
      return 3000
    },
  })
}
