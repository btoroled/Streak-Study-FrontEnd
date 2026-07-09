import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { teacherService } from '@/services/teacher.service'
import { QK } from '@/lib/query-keys'
import { MOCK_TEACHER_COURSES, MOCK_TEACHER_COURSE_METRICS } from '@/features/teacher/mockTeacherData'

export function useTeacherDashboard() {
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null)

  const coursesQuery = useQuery({
    queryKey: QK.teacherCourses,
    queryFn: ({ signal }) => teacherService.listCourses(signal),
    retry: false,
  })

  const coursesAreMock = coursesQuery.isError
  const courses = coursesQuery.data ?? (coursesAreMock ? MOCK_TEACHER_COURSES : [])
  const activeCourseId = selectedCourseId ?? courses[0]?.id ?? null

  const metricsQuery = useQuery({
    queryKey: QK.teacherCourseMetrics(activeCourseId ?? -1),
    queryFn: ({ signal }) => teacherService.getCourseMetrics(activeCourseId!, signal),
    enabled: activeCourseId !== null && !coursesAreMock,
    retry: false,
  })

  const metricsAreMock = coursesAreMock || metricsQuery.isError
  const fallbackMetrics = Object.values(MOCK_TEACHER_COURSE_METRICS)[0] ?? null
  const metrics = metricsAreMock
    ? (activeCourseId !== null ? MOCK_TEACHER_COURSE_METRICS[activeCourseId] ?? fallbackMetrics : fallbackMetrics)
    : metricsQuery.data ?? null

  return {
    courses,
    activeCourseId,
    setSelectedCourseId,
    metrics,
    isLoading: coursesQuery.isLoading || (!coursesAreMock && metricsQuery.isLoading),
    isMock: coursesAreMock || metricsAreMock,
  }
}
