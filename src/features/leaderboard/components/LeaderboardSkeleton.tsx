export default function LeaderboardSkeleton() {
  return (
    <div className="space-y-2">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3 bg-white/3 rounded-xl animate-pulse">
          <div className="w-7 h-4 bg-white/10 rounded" />
          <div className="w-8 h-8 bg-white/10 rounded-full" />
          <div className="flex-1 h-4 bg-white/10 rounded" />
          <div className="w-16 h-4 bg-white/10 rounded" />
        </div>
      ))}
    </div>
  )
}
