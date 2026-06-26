import RankBadge from './RankBadge'
import { useAuthStore } from '@/store/auth.store'
import type { LeaderboardUserResponse } from '@/types/user.types'

interface Props {
  entries: LeaderboardUserResponse[]
}

export default function LeaderboardTable({ entries }: Props) {
  const userId = useAuthStore((s) => s.userId)

  return (
    <div className="bg-surface-card border border-white/8 rounded-xl overflow-hidden">
      {entries.map((entry, i) => {
        const isMe = entry.id === userId
        return (
          <div
            key={entry.id}
            className={`flex items-center gap-3 px-4 py-3 border-b border-white/5 last:border-0 transition-colors ${
              isMe ? 'bg-orange-500/8 border-l-2 border-l-orange-500' : 'hover:bg-white/3'
            }`}
          >
            <RankBadge rank={i + 1} />
            <div className="w-8 h-8 rounded-full bg-purple-500/30 flex items-center justify-center text-xs font-bold text-purple-300 flex-shrink-0">
              {entry.fullName.charAt(0).toUpperCase()}
            </div>
            <span className={`flex-1 text-sm font-medium truncate ${isMe ? 'text-orange-300' : 'text-white'}`}>
              {entry.fullName} {isMe && '(tú)'}
            </span>
            <div className="text-right flex-shrink-0">
              <p className="text-sm font-bold text-white">{entry.points.toLocaleString()}</p>
              <p className="text-xs text-white/40">🔥 {entry.streak}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
