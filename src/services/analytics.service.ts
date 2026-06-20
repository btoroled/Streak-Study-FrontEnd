import api from './api.client'
import type { UserStats, ActivityPoint, ForecastPoint } from '@/types/analytics.types'

export const analyticsService = {
  getStats: () =>
    api.get<UserStats>('/users/me/stats').then(r => r.data),
  getActivity: (days = 30) =>
    api.get<ActivityPoint[]>(`/users/me/activity?days=${days}`).then(r => r.data),
  getForecast: (days = 14) =>
    api.get<ForecastPoint[]>(`/users/me/forecast?days=${days}`).then(r => r.data),
}
