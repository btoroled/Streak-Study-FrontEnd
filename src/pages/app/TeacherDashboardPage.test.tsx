import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import TeacherDashboardPage from './TeacherDashboardPage'
import type { TeacherCourseMetrics, TeacherCourseSummary } from '@/types/teacher.types'

const courses: TeacherCourseSummary[] = [
  {
    id: 1, name: 'Bases de Datos II', description: 'desc', code: 'CS2031',
    ownerId: 1, ownerName: 'Profe', studentsCount: 8, decksCount: 5,
    enrolled: false, createdAt: '2026-01-01', updatedAt: '2026-01-01',
  },
]

const metrics: TeacherCourseMetrics = {
  courseId: 1,
  courseName: 'Bases de Datos II',
  studentsCount: 8,
  activeStudents7d: 6,
  cardsStudied7d: 342,
  avgAccuracy7d: 0.81,
  topDecks: [{ deckId: 1, name: 'Normalización', reviews7d: 120 }],
  students: [
    { userId: 1, fullName: 'Ana Torres', lastActivity: '2026-07-08', weeklyScore: 42, currentStreak: 12, masteryPercent: 78 },
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
    expect(screen.getByText(/Mazos más repasados — Bases de Datos II/)).toBeInTheDocument()
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
