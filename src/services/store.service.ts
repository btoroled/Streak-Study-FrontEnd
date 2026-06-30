import api from './api.client'
import type { StoreItemResponse } from '@/types/store.types'

export const storeService = {
  catalog: () => api.get<StoreItemResponse[]>('/store/catalog').then(r => r.data),
  buyStreakFreeze: () => api.post('/store/streak-freeze').then(r => r.data),
}
