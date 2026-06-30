import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { storeService } from '@/services/store.service'
import { progressService } from '@/services/progress.service'
import { useAuthStore } from '@/store/auth.store'
import { QK } from '@/lib/query-keys'
import { getErrorMessage } from '@/lib/error.utils'

export function useStoreCatalog() {
  return useQuery({
    queryKey: QK.storeCatalog,
    queryFn: storeService.catalog,
    staleTime: 5 * 60 * 1000,
  })
}

export function useStore() {
  const qc = useQueryClient()
  const setProgress = useAuthStore((s) => s.setProgress)
  const streakFreezes = useAuthStore((s) => s.streakFreezes)
  const xp = useAuthStore((s) => s.xp)

  const buyStreakFreeze = useMutation({
    mutationFn: storeService.buyStreakFreeze,
    onSuccess: async () => {
      toast.success('¡Congelador de racha comprado!')
      try {
        const progress = await progressService.getProgress()
        setProgress(progress)
        qc.invalidateQueries({ queryKey: QK.progress })
        qc.invalidateQueries({ queryKey: QK.storeCatalog })
      } catch { /* silent */ }
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  })

  return { streakFreezes, xp, buyStreakFreeze }
}
