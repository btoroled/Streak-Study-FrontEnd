import { useState } from 'react'
import { Info, Printer } from 'lucide-react'
import PageHeader from '@/shared/components/layout/PageHeader'
import SectionCard from '@/shared/components/layout/SectionCard'
import { Button } from '@/shared/components/ui/button'
import TeacherKpiGrid from '@/features/teacher/components/TeacherKpiGrid'
import TopDecksChart from '@/features/teacher/components/TopDecksChart'
import StudentsTable from '@/features/teacher/components/StudentsTable'
import WeeklyReportSummary from '@/features/teacher/components/WeeklyReportSummary'
import WeeklyComparisonCards from '@/features/teacher/components/WeeklyComparisonCards'
import AtRiskStudentsList from '@/features/teacher/components/AtRiskStudentsList'
import { useTeacherDashboard } from '@/features/teacher/hooks/useTeacherDashboard'
import { useTeacherWeeklyReport } from '@/features/teacher/hooks/useTeacherWeeklyReport'

type Tab = 'resumen' | 'reporte'

function MockBanner() {
  return (
    <div className="flex items-center gap-2 bg-brand-purple/10 border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-brand-purple-light">
      <Info className="w-3.5 h-3.5 shrink-0" />
      <span>Datos de ejemplo — esperando integración con el backend.</span>
    </div>
  )
}

export default function TeacherDashboardPage() {
  const [tab, setTab] = useState<Tab>('resumen')
  const { courses, activeCourseId, setSelectedCourseId, metrics, isLoading, isMock } = useTeacherDashboard()
  const weeklyReport = useTeacherWeeklyReport(activeCourseId)

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PageHeader title="Panel de profesor" description="Actividad y progreso de tus cursos" />

      {courses.length > 1 && (
        <div className="flex gap-2">
          {courses.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCourseId(c.id)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                c.id === activeCourseId
                  ? 'bg-gradient-to-r from-brand-orange to-brand-purple text-white'
                  : 'bg-surface-card border border-surface-border text-text-secondary hover:text-text-primary'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-2 border-b border-surface-border">
        {([
          { key: 'resumen', label: 'Resumen' },
          { key: 'reporte', label: 'Reporte semanal' },
        ] as const).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === key
                ? 'border-brand-orange text-text-primary'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'resumen' && (
        <div className="space-y-6">
          {isMock && <MockBanner />}

          {isLoading ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 animate-pulse">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-[74px] rounded-xl bg-white/5" />
                ))}
              </div>
              <div className="h-56 rounded-xl bg-white/5 animate-pulse" />
            </div>
          ) : metrics ? (
            <div className="space-y-6">
              <TeacherKpiGrid metrics={metrics} />

              <SectionCard title={`Mazos más repasados — ${metrics.courseName}`}>
                <TopDecksChart topDecks={metrics.topDecks} />
              </SectionCard>

              <SectionCard title="Alumnos">
                <StudentsTable students={metrics.students} />
              </SectionCard>
            </div>
          ) : (
            <p className="text-sm text-text-muted py-8 text-center">Aún no tienes cursos asignados.</p>
          )}
        </div>
      )}

      {tab === 'reporte' && (
        <div className="space-y-6">
          {weeklyReport.isMock && <MockBanner />}

          {weeklyReport.isLoading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-16 rounded-xl bg-white/5" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[...Array(3)].map((_, i) => <div key={i} className="h-20 rounded-xl bg-white/5" />)}
              </div>
            </div>
          ) : weeklyReport.report ? (
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4">
                <WeeklyReportSummary summary={weeklyReport.report.summary} />
                <Button variant="outline" size="sm" onClick={() => window.print()} className="shrink-0">
                  <Printer className="w-4 h-4 mr-1.5" /> Imprimir
                </Button>
              </div>

              <WeeklyComparisonCards totals={weeklyReport.report.totals} previousWeek={weeklyReport.report.previousWeek} />

              <SectionCard title="Alumnos en riesgo">
                <AtRiskStudentsList students={weeklyReport.report.students} />
              </SectionCard>
            </div>
          ) : (
            <p className="text-sm text-text-muted py-8 text-center">Aún no hay datos para el reporte semanal.</p>
          )}
        </div>
      )}
    </div>
  )
}
