import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import TeacherDashboardPage from './TeacherDashboardPage'
import type { TeacherCourseMetrics, TeacherCourseSummary } from '@/types/teacher.types'

const courses: TeacherCourseSummary[] = [
  { id: 1, name: 'Bases de Datos II', code: 'CS2031', studentsCount: 8 },
]

const metrics: TeacherCourseMetrics = {
  courseId: 1,
  courseName: 'Bases de Datos II',
  activeStudents7d: 6,
  cardsStudied7d: 342,
  averageAccuracy: 0.81,
  currentStreakAvg: 5,
  weeklyActivity: [{ date: '2026-07-01', reviews: 20 }],
  students: [
    { userId: 1, name: 'Ana Torres', lastActivityAt: '2026-07-08T00:00:00.000Z', xpWeekly: 420, masteryPercent: 78 },
  ],
}

const mockUseTeacherDashboard = vi.fn()
vi.mock('@/features/teacher/hooks/useTeacherDashboard', () => ({
  useTeacherDashboard: () => mockUseTeacherDashboard(),
}))

function renderPage() {
  return render(
    <MemoryRouter>
      <TeacherDashboardPage />
    </MemoryRouter>,
  )
}

describe('TeacherDashboardPage', () => {
  it('muestra KPIs, alumno y aviso de datos de ejemplo cuando isMock=true', () => {
    mockUseTeacherDashboard.mockReturnValue({
      courses,
      activeCourseId: 1,
      setSelectedCourseId: vi.fn(),
      metrics,
      isLoading: false,
      isMock: true,
    })

    renderPage()

    expect(screen.getByText(/datos de ejemplo/i)).toBeInTheDocument()
    expect(screen.getByText('Ana Torres')).toBeInTheDocument()
    expect(screen.getByText(/Actividad semanal — Bases de Datos II/)).toBeInTheDocument()
  })

  it('no muestra el aviso de mock cuando isMock=false', () => {
    mockUseTeacherDashboard.mockReturnValue({
      courses,
      activeCourseId: 1,
      setSelectedCourseId: vi.fn(),
      metrics,
      isLoading: false,
      isMock: false,
    })

    renderPage()

    expect(screen.queryByText(/datos de ejemplo/i)).not.toBeInTheDocument()
  })

  it('muestra skeleton mientras isLoading=true', () => {
    mockUseTeacherDashboard.mockReturnValue({
      courses: [],
      activeCourseId: null,
      setSelectedCourseId: vi.fn(),
      metrics: null,
      isLoading: true,
      isMock: false,
    })

    renderPage()

    expect(screen.queryByText('Ana Torres')).not.toBeInTheDocument()
  })
})
