import { motion } from 'framer-motion'

interface Props {
  badgeName: string
  badgeIcon: string
  onClose: () => void
}

export default function BadgeUnlockedModal({ badgeName, badgeIcon, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative z-10 bg-[#16171f] border border-orange-500/30 rounded-2xl p-8 text-center max-w-xs w-full shadow-2xl"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <div className="text-6xl mb-4">{badgeIcon}</div>
        <h2 className="text-lg font-bold text-white">¡Insignia desbloqueada!</h2>
        <p className="text-sm text-white/60 mt-1">{badgeName}</p>
        <button
          className="mt-5 w-full py-2.5 rounded-xl bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors"
          onClick={onClose}
        >
          ¡Genial!
        </button>
      </motion.div>
    </div>
  )
}
