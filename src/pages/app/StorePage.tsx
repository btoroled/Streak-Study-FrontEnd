import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import StreakFreezeCard from '@/features/store/components/StreakFreezeCard'
import PurchaseConfirmDialog from '@/features/store/components/PurchaseConfirmDialog'
import { useStore } from '@/features/store/hooks/useStore'

export default function StorePage() {
  const { streakFreezes, xp, buyStreakFreeze } = useStore()
  const [confirm, setConfirm] = useState(false)

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Tienda</h1>
        <p className="text-sm text-white/50 mt-0.5">Tu XP actual: <span className="text-orange-400 font-semibold">{xp.toLocaleString()}</span></p>
      </div>

      <StreakFreezeCard
        currentFreezes={streakFreezes}
        userXp={xp}
        onBuy={() => setConfirm(true)}
        isLoading={buyStreakFreeze.isPending}
      />

      <AnimatePresence>
        {confirm && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setConfirm(false)} />
            <motion.div className="relative z-10 w-full max-w-sm bg-surface-card border border-white/10 rounded-2xl p-6 shadow-2xl"
              initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 16 }}>
              <PurchaseConfirmDialog
                title="Congelador de racha"
                description="Protege tu racha por un día de inactividad"
                cost={200}
                onConfirm={() => buyStreakFreeze.mutateAsync(undefined).then(() => setConfirm(false))}
                onCancel={() => setConfirm(false)}
                isLoading={buyStreakFreeze.isPending}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
