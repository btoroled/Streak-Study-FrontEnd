import { useQuery } from '@tanstack/react-query'
import { teacherService } from '@/services/teacher.service'
import { QK } from '@/lib/query-keys'
import { MOCK_TEACHER_WEEKLY_REPORT } from '@/features/teacher/mockTeacherData'

export function useTeacherWeeklyReport(courseId: number | null) {
  const query = useQuery({
    queryKey: QK.teacherWeeklyReport(courseId ?? -1),
    queryFn: ({ signal }) => teacherService.getWeeklyReport(courseId!, signal),
    enabled: courseId !== null,
    retry: false,
  })

  const isMock = query.isError
  const fallback = Object.values(MOCK_TEACHER_WEEKLY_REPORT)[0] ?? null
  const report = isMock
    ? (courseId !== null ? MOCK_TEACHER_WEEKLY_REPORT[courseId] ?? fallback : fallback)
    : query.data ?? null

  return {
    report,
    isLoading: query.isLoading,
    isMock,
  }
}
