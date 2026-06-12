import api from './api.client'
import type { InstitutionRequest, InstitutionResponse } from '@/types/institution.types'

export const institutionsService = {
  create: (data: InstitutionRequest) =>
    api.post<InstitutionResponse>('/institutions', data).then(r => r.data),
  get: (id: number) =>
    api.get<InstitutionResponse>(/institutions/).then(r => r.data),
}
