interface Props {
  xp: number
  currentStreak: number
  streakFreezes: number
}

const STAT = ({ label, value, suffix = '' }: { label: string; value: number; suffix?: string }) => (
  <div className="bg-surface-card border border-surface-border rounded-xl p-4 text-center">
    <p className="text-2xl font-black text-text-primary">{value.toLocaleString()}{suffix}</p>
    <p className="text-xs text-text-muted mt-0.5">{label}</p>
  </div>
)

export default function StatsPanel({ xp, currentStreak, streakFreezes }: Props) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <STAT label="XP total" value={xp} />
      <STAT label="Racha actual" value={currentStreak} suffix=" 🔥" />
      <STAT label="Congeladores" value={streakFreezes} suffix=" ❄️" />
    </div>
  )
}
