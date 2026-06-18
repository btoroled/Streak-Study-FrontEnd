import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import AchievementsGrid from '@/features/achievements/components/AchievementsGrid'
import BadgePurchaseDialog from '@/features/achievements/components/BadgePurchaseDialog'
import BadgeUnlockedModal from '@/features/achievements/components/BadgeUnlockedModal'
import { useAchievements, BADGE_CATALOG } from '@/features/achievements/hooks/useAchievements'
import mascotCelebrate from '@/assets/brand/levels/level-7.png'

export default function AchievementsPage() {
  const { badges, userBadges, xp, buyBadge } = useAchievements()
  const [buying, setBuying] = useState<string | null>(null)
  const [unlocked, setUnlocked] = useState<string | null>(null)

  const badge = BADGE_CATALOG.find((b) => b.id === buying)
  const pct = badges.length > 0 ? Math.round((userBadges.length / badges.length) * 100) : 0

  const handleBuy = async () => {
    if (!badge) return
    await buyBadge.mutateAsync(badge.id)
    setBuying(null)
    setUnlocked(badge.id)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header con mascota y progreso */}
      <div className="flex items-center gap-4 bg-gradient-to-r from-[#f97316]/10 to-[#7c3aed]/10 border border-[#2a2b38] rounded-2xl p-5">
        <img
          src={mascotCelebrate}
          alt=""
          className="w-16 h-16 object-contain shrink-0 drop-shadow-xl animate-[float_4s_ease-in-out_infinite]"
        />
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-white">Logros</h1>
          <p className="text-sm text-white/50 mt-0.5">
            {userBadges.length} de {badges.length} insignias desbloqueadas
          </p>
          <div className="mt-2 h-2 rounded-full bg-[#2a2b38] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-[#f97316] to-[#7c3aed] rounded-full"
            />
          </div>
        </div>
      </div>

      <AchievementsGrid userBadges={userBadges} userXp={xp} onBuy={setBuying} />

      <AnimatePresence>
        {buying && badge && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setBuying(null)} />
            <motion.div className="relative z-10 w-full max-w-sm bg-[#16171f] border border-white/10 rounded-2xl p-6 shadow-2xl"
              initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 16 }}>
              <BadgePurchaseDialog
                badgeName={badge.name}
                badgeIcon={badge.icon}
                xpCost={badge.xpCost}
                onConfirm={handleBuy}
                onCancel={() => setBuying(null)}
                isLoading={buyBadge.isPending}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {unlocked && (() => {
        const b = BADGE_CATALOG.find((x) => x.id === unlocked)
        return b ? <BadgeUnlockedModal badgeName={b.name} badgeIcon={b.icon} onClose={() => setUnlocked(null)} /> : null
      })()}
    </div>
  )
}
