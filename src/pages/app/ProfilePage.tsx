import ProfileHeader from '@/features/profile/components/ProfileHeader'
import StatsPanel from '@/features/profile/components/StatsPanel'
import BadgesCollection from '@/features/profile/components/BadgesCollection'
import SecuritySection from '@/features/profile/components/SecuritySection'
import { useProfile } from '@/features/profile/hooks/useProfile'

export default function ProfilePage() {
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

      <div className="bg-[#16171f] border border-white/8 rounded-xl p-5 space-y-5">
        <ProfileHeader fullName={fullName} email={email} role={role} />
        <StatsPanel xp={xp} currentStreak={currentStreak} streakFreezes={streakFreezes} />
        <BadgesCollection userBadges={badges} />
      </div>

      <SecuritySection />
    </div>
  )
}
