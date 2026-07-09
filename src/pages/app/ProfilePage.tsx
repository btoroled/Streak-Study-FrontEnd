import { useNavigate } from 'react-router-dom'
import { GraduationCap, ChevronRight } from 'lucide-react'
import ProfileHeader from '@/features/profile/components/ProfileHeader'
import StatsPanel from '@/features/profile/components/StatsPanel'
import BadgesCollection from '@/features/profile/components/BadgesCollection'
import SecuritySection from '@/features/profile/components/SecuritySection'
import CreateUserSection from '@/features/team/components/CreateUserSection'
import RoleGuard from '@/shared/components/guards/RoleGuard'
import { useProfile } from '@/features/profile/hooks/useProfile'
import { ROUTES } from '@/config/routes'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { fullName, email, role, xp, currentStreak, streakFreezes, badges, isLoading } = useProfile()

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4 animate-pulse">
        <div className="flex gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/5" />
          <div className="space-y-2 flex-1">
            <div className="h-5 w-40 bg-white/5 rounded" />
            <div className="h-4 w-60 bg-white/5 rounded" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[...Array(3)].map((_, i) => <div key={i} className="h-20 rounded-xl bg-white/5" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-xl font-bold text-white">Mi perfil</h1>

      <div className="bg-surface-card border border-white/8 rounded-xl p-5 space-y-5">
        <ProfileHeader fullName={fullName} email={email} role={role} />
        <StatsPanel xp={xp} currentStreak={currentStreak} streakFreezes={streakFreezes} />
        <BadgesCollection userBadges={badges} />
      </div>

      <SecuritySection />

      {/* fallback={null}: sin él, un STUDENT sería redirigido a /403 en su propio perfil */}
      <RoleGuard permission="view:teacher-dashboard" fallback={null}>
        <button
          onClick={() => navigate(ROUTES.TEACHER)}
          className="w-full flex items-center gap-3 bg-surface-card border border-surface-border rounded-xl p-4 hover:border-brand-purple/40 transition-colors text-left"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-purple to-brand-purple-light flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text-primary">Panel de profesor</p>
            <p className="text-xs text-text-secondary">Actividad y progreso de tus cursos</p>
          </div>
          <ChevronRight className="w-4 h-4 text-text-muted shrink-0" />
        </button>
      </RoleGuard>

      {/* fallback={null}: sin él, un STUDENT sería redirigido a /403 en su propio perfil */}
      <RoleGuard permission="manage:users" fallback={null}>
        <CreateUserSection />
      </RoleGuard>
    </div>
  )
}
