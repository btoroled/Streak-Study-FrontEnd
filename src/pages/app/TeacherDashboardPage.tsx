import { Info } from 'lucide-react'
import PageHeader from '@/shared/components/layout/PageHeader'
import SectionCard from '@/shared/components/layout/SectionCard'
import TeacherKpiGrid from '@/features/teacher/components/TeacherKpiGrid'
import WeeklyActivityChart from '@/features/teacher/components/WeeklyActivityChart'
import StudentsTable from '@/features/teacher/components/StudentsTable'
import { useTeacherDashboard } from '@/features/teacher/hooks/useTeacherDashboard'

export default function TeacherDashboardPage() {
  const { courses, activeCourseId, setSelectedCourseId, metrics, isLoading, isMock } = useTeacherDashboard()

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PageHeader title="Panel de profesor" description="Actividad y progreso de tus cursos" />

      {isMock && (
        <div className="flex items-center gap-2 bg-brand-purple/10 border border-brand-purple/30 rounded-lg px-3 py-2 text-xs text-brand-purple-light">
          <Info className="w-3.5 h-3.5 shrink-0" />
          <span>Datos de ejemplo — esperando integración con el backend.</span>
        </div>
      )}

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

          <SectionCard title={`Actividad semanal — ${metrics.courseName}`}>
            <WeeklyActivityChart data={metrics.weeklyActivity} />
          </SectionCard>

          <SectionCard title="Alumnos">
            <StudentsTable students={metrics.students} />
          </SectionCard>
        </div>
      ) : (
        <p className="text-sm text-text-muted py-8 text-center">Aún no tienes cursos asignados.</p>
      )}
    </div>
  )
}
