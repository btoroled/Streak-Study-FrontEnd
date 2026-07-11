import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useTeacherWeeklyReport } from './useTeacherWeeklyReport'
import { teacherService } from '@/services/teacher.service'
import { MOCK_TEACHER_WEEKLY_REPORT } from '../mockTeacherData'

vi.mock('@/services/teacher.service', () => ({
  teacherService: {
    getWeeklyReport: vi.fn(),
  },
}))

function wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

describe('useTeacherWeeklyReport', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('BE-4 no responde → cae a datos mock con isMock=true', async () => {
    vi.mocked(teacherService.getWeeklyReport).mockRejectedValue(new Error('Request failed with status code 404'))

    const { result } = renderHook(() => useTeacherWeeklyReport(1), { wrapper })

    await waitFor(() => expect(result.current.isMock).toBe(true))
    expect(result.current.report).toEqual(MOCK_TEACHER_WEEKLY_REPORT[1])
  })

  it('BE-4 responde bien → usa el reporte real, isMock=false', async () => {
    const realReport = {
      courseId: 1,
      weekStart: '2026-07-01',
      weekEnd: '2026-07-07',
      totals: { reviews: 50, activeStudents: 2, accuracy: 0.9 },
      previousWeek: { reviews: 40, activeStudents: 2, accuracy: 0.85 },
      students: [],
      summary: null,
    }
    vi.mocked(teacherService.getWeeklyReport).mockResolvedValue(realReport)

    const { result } = renderHook(() => useTeacherWeeklyReport(1), { wrapper })

    await waitFor(() => expect(result.current.report).toEqual(realReport))
    expect(result.current.isMock).toBe(false)
  })

  it('sin curso seleccionado → no dispara la query', () => {
    const { result } = renderHook(() => useTeacherWeeklyReport(null), { wrapper })

    expect(result.current.isLoading).toBe(false)
    expect(teacherService.getWeeklyReport).not.toHaveBeenCalled()
  })
})
