import api from './api.client'

export const storeService = {
  buyStreakFreeze: () => api.post('/store/streak-freeze').then(r => r.data),
}
