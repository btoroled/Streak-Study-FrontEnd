interface Props { rank: number }

const MEDALS: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' }

export default function RankBadge({ rank }: Props) {
  if (MEDALS[rank]) return <span className="text-lg">{MEDALS[rank]}</span>
  return (
    <span className="w-7 h-7 flex items-center justify-center text-xs font-bold text-white/40">
      #{rank}
    </span>
  )
}
