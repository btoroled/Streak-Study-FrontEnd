import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { progressService } from '@/services/progress.service'
import { useAuthStore } from '@/store/auth.store'
import { QK } from '@/lib/query-keys'

/**
 * Fuente de verdad de progress: React Query fetcha, Zustand espeja para lectura
 * síncrona (sidebar, gating, offline). Mantener una sola lectura cualquier UI
 * lee del store y usa los flags del query para loading/error.
 */
export function useProgress() {
  const setProgress = useAuthStore((s) => s.setProgress)

  const query = useQuery({
    queryKey: QK.progress,
    queryFn: progressService.getProgress,
    staleTime: 1000 * 60 * 2,
  })

  useEffect(() => {
    if (query.data) setProgress(query.data)
  }, [query.data, setProgress])

  return query
}
