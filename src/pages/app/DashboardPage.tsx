import WelcomeCard from '@/features/dashboard/components/WelcomeCard'
import StatsGrid from '@/features/dashboard/components/StatsGrid'
import XpLevelCard from '@/features/dashboard/components/XpLevelCard'
import ActivityCalendar from '@/features/dashboard/components/ActivityCalendar'
import RecentAchievements from '@/features/dashboard/components/RecentAchievements'
import QuickStudyCta from '@/features/dashboard/components/QuickStudyCta'

export default function DashboardPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <WelcomeCard />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-4">
          <StatsGrid />
          <XpLevelCard />
          <ActivityCalendar />
        </div>

        {/* Sidebar column */}
        <div className="space-y-4">
          <QuickStudyCta />
          <RecentAchievements />
        </div>
      </div>
    </div>
  )
}
