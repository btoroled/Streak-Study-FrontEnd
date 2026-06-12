import BadgeCard from './BadgeCard'
import { BADGE_CATALOG } from '../hooks/useAchievements'

interface Props {
  userBadges: string[]
  userXp: number
  onBuy: (id: string) => void
}

export default function AchievementsGrid({ userBadges, userXp, onBuy }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {BADGE_CATALOG.map((b) => (
        <BadgeCard
          key={b.id}
          {...b}
          isUnlocked={userBadges.includes(b.id)}
          userXp={userXp}
          onBuy={onBuy}
        />
      ))}
    </div>
  )
}
