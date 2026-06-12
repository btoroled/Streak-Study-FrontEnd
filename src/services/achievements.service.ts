import api from './api.client'
import type { BadgePurchaseRequest } from '@/types/achievement.types'

export const achievementsService = {
  buyBadge: (data: BadgePurchaseRequest) =>
    api.post('/store/badges', data).then(r => r.data),
}
