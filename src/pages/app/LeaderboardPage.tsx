import LeaderboardTable from '@/features/leaderboard/components/LeaderboardTable'
import LeaderboardSkeleton from '@/features/leaderboard/components/LeaderboardSkeleton'
import LeaderboardUnavailable from '@/features/leaderboard/components/LeaderboardUnavailable'
import { useLeaderboardQuery } from '@/features/leaderboard/hooks/useLeaderboardQuery'

export default function LeaderboardPage() {
  const { data: entries = [], isLoading } = useLeaderboardQuery()

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Ranking</h1>
        <p className="text-sm text-white/50 mt-0.5">Top estudiantes de tu institución</p>
      </div>

      {isLoading ? (
        <LeaderboardSkeleton />
      ) : entries.length === 0 ? (
        <LeaderboardUnavailable />
      ) : (
        <LeaderboardTable entries={entries} />
      )}
    </div>
  )
}
