import api from './api.client'
import type { InstitutionRequest, InstitutionResponse, InstitutionSummary } from '@/types/institution.types'

export const institutionsService = {
  create: (data: InstitutionRequest) =>
    api.post<InstitutionResponse>('/institutions', data).then(r => r.data),
  list: () =>
    api.get<InstitutionSummary[]>('/institutions').then(r => r.data),
  get: (id: number) =>
    api.get<InstitutionResponse>(`/institutions/${id}`).then(r => r.data),
}
