import { useQuery } from '@tanstack/react-query'
import { analyticsService } from '@/services/analytics.service'
import { QK } from '@/lib/query-keys'

export function useAnalytics(activityDays = 30, forecastDays = 14) {
  const stats = useQuery({
    queryKey: QK.stats,
    queryFn: ({ signal }) => analyticsService.getStats(signal),
  })
  const activity = useQuery({
    queryKey: QK.activity(activityDays),
    queryFn: ({ signal }) => analyticsService.getActivity(activityDays, signal),
  })
  const forecast = useQuery({
    queryKey: QK.forecast(forecastDays),
    queryFn: ({ signal }) => analyticsService.getForecast(forecastDays, signal),
  })

  return { stats, activity, forecast }
}
