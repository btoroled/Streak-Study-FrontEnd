import { useQuery } from '@tanstack/react-query'
import { documentsService } from '@/services/documents.service'
import { QK } from '@/lib/query-keys'

const MIN_INTERVAL_MS = 3000
const MAX_INTERVAL_MS = 30_000

export function useDocumentStatusPolling(documentId: number | null) {
  return useQuery({
    queryKey: QK.documentStatus(documentId ?? 0),
    queryFn: () => documentsService.getStatus(documentId!),
    enabled: documentId !== null && documentId > 0,
    refetchInterval: (query) => {
      const status = query.state.data?.status
      if (status === 'READY' || status === 'FAILED' || status === 'OCR_REQUIRED') return false
      const attempt = query.state.dataUpdateCount
      return Math.min(MAX_INTERVAL_MS, MIN_INTERVAL_MS * Math.pow(1.5, attempt))
    },
  })
}
