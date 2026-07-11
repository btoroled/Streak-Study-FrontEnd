import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import TeacherDashboardPage from './TeacherDashboardPage'
import type { TeacherCourseMetrics, TeacherCourseSummary, TeacherWeeklyReport } from '@/types/teacher.types'

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

const weeklyReport: TeacherWeeklyReport = {
  courseId: 1,
  weekStart: '2026-07-01',
  weekEnd: '2026-07-07',
  totals: { reviews: 147, activeStudents: 6, accuracy: 0.81 },
  previousWeek: { reviews: 118, activeStudents: 5, accuracy: 0.76 },
  students: [
    { userId: 7, fullName: 'Gabriela Ríos', reviews7d: 3, reviewsPrevWeek: 0, lastActivity: '2026-07-03', atRisk: true },
  ],
  summary: 'Resumen de ejemplo generado por IA.',
}

const mockUseTeacherDashboard = vi.fn()
const mockUseTeacherWeeklyReport = vi.fn()
vi.mock('@/features/teacher/hooks/useTeacherDashboard', () => ({
  useTeacherDashboard: () => mockUseTeacherDashboard(),
}))
vi.mock('@/features/teacher/hooks/useTeacherWeeklyReport', () => ({
  useTeacherWeeklyReport: () => mockUseTeacherWeeklyReport(),
}))

function renderPage() {
  return render(
    <MemoryRouter>
      <TeacherDashboardPage />
    </MemoryRouter>,
  )
}

describe('TeacherDashboardPage', () => {
  beforeEach(() => {
    mockUseTeacherDashboard.mockReturnValue({
      courses, activeCourseId: 1, setSelectedCourseId: vi.fn(), metrics, isLoading: false, isMock: true,
    })
    mockUseTeacherWeeklyReport.mockReturnValue({
      report: weeklyReport, isLoading: false, isMock: true,
    })
  })

  it('muestra KPIs, alumno y aviso de datos de ejemplo cuando isMock=true', () => {
    renderPage()

    expect(screen.getByText(/datos de ejemplo/i)).toBeInTheDocument()
    expect(screen.getByText('Ana Torres')).toBeInTheDocument()
    expect(screen.getByText(/Mazos más repasados — Bases de Datos II/)).toBeInTheDocument()
  })

  it('no muestra el aviso de mock cuando isMock=false', () => {
    mockUseTeacherDashboard.mockReturnValue({
      courses, activeCourseId: 1, setSelectedCourseId: vi.fn(), metrics, isLoading: false, isMock: false,
    })

    renderPage()

    expect(screen.queryByText(/datos de ejemplo/i)).not.toBeInTheDocument()
  })

  it('muestra skeleton mientras isLoading=true', () => {
    mockUseTeacherDashboard.mockReturnValue({
      courses: [], activeCourseId: null, setSelectedCourseId: vi.fn(), metrics: null, isLoading: true, isMock: false,
    })

    renderPage()

    expect(screen.queryByText('Ana Torres')).not.toBeInTheDocument()
  })

  it('tab "Reporte semanal": muestra resumen, comparativa y alumnos en riesgo', () => {
    renderPage()

    fireEvent.click(screen.getByRole('button', { name: 'Reporte semanal' }))

    expect(screen.getByText('Resumen de ejemplo generado por IA.')).toBeInTheDocument()
    expect(screen.getByText('Gabriela Ríos')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /imprimir/i })).toBeInTheDocument()
  })
})
