import api from './api.client'
import type { RewardItemResponse } from '@/types/store.types'

export const rewardsService = {
  list: () => api.get<RewardItemResponse[]>('/rewards').then(r => r.data),
}
