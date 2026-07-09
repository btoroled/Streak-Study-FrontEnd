import api from './api.client'
import type { AdminStatsResponse, InstitutionStatsRow } from '@/types/admin.types'

export const adminService = {
  stats: () =>
    api.get<AdminStatsResponse>('/admin/stats').then(r => r.data),
  institutionStats: () =>
    api.get<InstitutionStatsRow[]>('/admin/stats/institutions').then(r => r.data),
}
