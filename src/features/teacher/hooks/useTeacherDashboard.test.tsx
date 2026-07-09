import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useTeacherDashboard } from './useTeacherDashboard'
import { teacherService } from '@/services/teacher.service'
import { MOCK_TEACHER_COURSES, MOCK_TEACHER_COURSE_METRICS } from '../mockTeacherData'

vi.mock('@/services/teacher.service', () => ({
  teacherService: {
    listCourses: vi.fn(),
    getCourseMetrics: vi.fn(),
  },
}))

function wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

describe('useTeacherDashboard', () => {
  it('BE-3 no existe todavía (404/network) → cae a datos mock con isMock=true', async () => {
    vi.mocked(teacherService.listCourses).mockRejectedValue(new Error('Request failed with status code 404'))

    const { result } = renderHook(() => useTeacherDashboard(), { wrapper })

    await waitFor(() => expect(result.current.isMock).toBe(true))

    expect(result.current.courses).toEqual(MOCK_TEACHER_COURSES)
    expect(result.current.metrics).toEqual(MOCK_TEACHER_COURSE_METRICS[1])
  })

  it('BE-3 responde bien → usa los datos reales, isMock=false', async () => {
    const realCourses = [{ id: 42, name: 'Curso real', code: 'REAL', studentsCount: 3 }]
    const realMetrics = {
      courseId: 42,
      courseName: 'Curso real',
      activeStudents7d: 3,
      cardsStudied7d: 10,
      averageAccuracy: 0.9,
      currentStreakAvg: 2,
      weeklyActivity: [],
      students: [],
    }
    vi.mocked(teacherService.listCourses).mockResolvedValue(realCourses)
    vi.mocked(teacherService.getCourseMetrics).mockResolvedValue(realMetrics)

    const { result } = renderHook(() => useTeacherDashboard(), { wrapper })

    await waitFor(() => expect(result.current.metrics).toEqual(realMetrics))
    expect(result.current.isMock).toBe(false)
    expect(result.current.courses).toEqual(realCourses)
  })
})
