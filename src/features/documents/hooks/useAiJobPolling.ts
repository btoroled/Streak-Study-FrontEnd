import { useQuery, useQueryClient } from '@tanstack/react-query'
import { documentsService } from '@/services/documents.service'
import { QK } from '@/lib/query-keys'

const MIN_INTERVAL_MS = 3000
const MAX_INTERVAL_MS = 30_000

/**
 * Sondea un job de IA con backoff exponencial — 3s, 4.5s, 6.7s, …, tope 30s.
 * Reduce ~10× los requests cuando un job tarda varios minutos, sin sacrificar
 * la primera lectura rápida cuando el job termina pronto.
 */
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

      const attempt = query.state.dataUpdateCount
      const next = Math.min(MAX_INTERVAL_MS, MIN_INTERVAL_MS * Math.pow(1.5, attempt))
      return next
    },
  })
}
