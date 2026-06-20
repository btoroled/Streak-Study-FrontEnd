import { useQuery } from '@tanstack/react-query'
import { analyticsService } from '@/services/analytics.service'
import { QK } from '@/lib/query-keys'

export function useAnalytics(activityDays = 30, forecastDays = 14) {
  const stats = useQuery({ queryKey: QK.stats, queryFn: analyticsService.getStats })
  const activity = useQuery({
    queryKey: QK.activity(activityDays),
    queryFn: () => analyticsService.getActivity(activityDays),
  })
  const forecast = useQuery({
    queryKey: QK.forecast(forecastDays),
    queryFn: () => analyticsService.getForecast(forecastDays),
  })

  return { stats, activity, forecast }
}
