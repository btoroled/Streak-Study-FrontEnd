import { useQuery } from '@tanstack/react-query'
import { documentsService } from '@/services/documents.service'
import { QK } from '@/lib/query-keys'

export function useDocumentStatusPolling(documentId: number | null) {
  return useQuery({
    queryKey: QK.documentStatus(documentId ?? 0),
    queryFn: () => documentsService.getStatus(documentId!),
    enabled: documentId !== null && documentId > 0,
    refetchInterval: (query) => {
      const status = query.state.data?.status
      if (status === 'READY' || status === 'FAILED') return false
      return 3000
    },
  })
}
