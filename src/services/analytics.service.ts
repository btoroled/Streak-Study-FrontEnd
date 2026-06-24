import api from './api.client'
import type { UserStats, ActivityPoint, ForecastPoint } from '@/types/analytics.types'

export const analyticsService = {
  getStats: (signal?: AbortSignal) =>
    api.get<UserStats>('/users/me/stats', { signal }).then(r => r.data),
  getActivity: (days = 30, signal?: AbortSignal) =>
    api.get<ActivityPoint[]>(`/users/me/activity?days=${days}`, { signal }).then(r => r.data),
  getForecast: (days = 14, signal?: AbortSignal) =>
    api.get<ForecastPoint[]>(`/users/me/forecast?days=${days}`, { signal }).then(r => r.data),
}
