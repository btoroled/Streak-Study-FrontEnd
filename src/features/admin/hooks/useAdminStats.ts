import { useQuery } from '@tanstack/react-query'
import { adminService } from '@/services/admin.service'
import { QK } from '@/lib/query-keys'

export function useAdminStats() {
  return useQuery({
    queryKey: QK.adminStats,
    queryFn: () => adminService.stats(),
    staleTime: 60 * 1000,
  })
}

export function useInstitutionStats() {
  return useQuery({
    queryKey: QK.adminInstitutionStats,
    queryFn: () => adminService.institutionStats(),
    staleTime: 60 * 1000,
  })
}
