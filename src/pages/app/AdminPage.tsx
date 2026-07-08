import PageHeader from '@/shared/components/layout/PageHeader'
import SectionCard from '@/shared/components/layout/SectionCard'
import KpiGrid from '@/features/admin/components/KpiGrid'
import UsersByRoleChart from '@/features/admin/components/UsersByRoleChart'
import InstitutionsTable from '@/features/admin/components/InstitutionsTable'
import CreateUserSection from '@/features/team/components/CreateUserSection'
import { useAdminStats, useInstitutionStats } from '@/features/admin/hooks/useAdminStats'

export default function AdminPage() {
  const stats = useAdminStats()
  const institutions = useInstitutionStats()

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        title="Panel de plataforma"
        description="Métricas globales de StreakStudy — solo visible para SUPER_ADMIN"
      />

      {stats.isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 animate-pulse">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="h-[74px] rounded-xl bg-white/5" />
          ))}
        </div>
      ) : stats.isError ? (
        <p className="text-sm text-error">No se pudieron cargar las métricas de plataforma.</p>
      ) : stats.data ? (
        <div className="space-y-6">
          <KpiGrid stats={stats.data} />

          <div className="grid lg:grid-cols-2 gap-4">
            <SectionCard title="Usuarios por rol">
              <UsersByRoleChart usersByRole={stats.data.usersByRole} />
            </SectionCard>

            <SectionCard title="Instituciones (ranking por usuarios)">
              {institutions.isLoading ? (
                <div className="space-y-3 animate-pulse">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-8 rounded bg-white/5" />
                  ))}
                </div>
              ) : institutions.isError ? (
                <p className="text-sm text-error">No se pudo cargar el desglose.</p>
              ) : (
                <InstitutionsTable rows={institutions.data ?? []} />
              )}
            </SectionCard>
          </div>

          <CreateUserSection />
        </div>
      ) : null}
    </div>
  )
}
