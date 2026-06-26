import { motion } from 'framer-motion'
import Confetti from '@/shared/components/gamification/Confetti'

interface Props {
  badgeName: string
  badgeIcon: string
  onClose: () => void
}

export default function BadgeUnlockedModal({ badgeName, badgeIcon, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative z-10 bg-surface-card border border-orange-500/30 rounded-2xl p-8 text-center max-w-xs w-full shadow-2xl overflow-hidden"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <Confetti count={50} duration={3} />

        <p className="relative text-xs font-semibold uppercase tracking-widest text-[#f97316] mb-3">
          ¡Insignia desbloqueada!
        </p>
        <motion.div
          className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-[#1e1f2a] to-[#16171f] ring-2 ring-[#f97316]/40 mb-4 text-5xl"
          initial={{ scale: 0.4, rotate: -12, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 240, damping: 16, delay: 0.1 }}
        >
          {badgeIcon}
        </motion.div>
        <h2 className="relative text-lg font-bold text-white">{badgeName}</h2>
        <button
          className="relative mt-5 w-full py-2.5 rounded-xl bg-gradient-to-r from-[#f97316] to-[#7c3aed] text-white text-sm font-medium hover:opacity-90 transition-opacity"
          onClick={onClose}
        >
          ¡Genial!
        </button>
      </motion.div>
    </div>
  )
}
