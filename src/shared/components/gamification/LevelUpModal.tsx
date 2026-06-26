import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/shared/components/ui/button'
import Confetti from './Confetti'
import { LevelAvatar } from './LevelAvatar'

interface LevelUpModalProps {
  open: boolean
  level: number
  name: string
  onClose: () => void
}

export default function LevelUpModal({ open, level, name, onClose }: LevelUpModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="relative w-full max-w-sm rounded-2xl bg-surface-card border border-surface-border p-8 text-center overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <Confetti count={60} duration={3.2} />

            <p className="text-xs font-semibold uppercase tracking-widest text-[#f97316] mb-4">
              ¡Subiste de nivel!
            </p>

            <motion.div
              initial={{ scale: 0.4, rotate: -12, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 240, damping: 16, delay: 0.1 }}
              className="flex justify-center mb-4"
            >
              <LevelAvatar level={level} size={120} showBadge alt={name} />
            </motion.div>

            <h2 className="text-2xl font-black text-white">{name}</h2>
            <p className="text-sm text-white/50 mt-1 mb-6">Nivel {level} alcanzado</p>

            <Button size="lg" className="w-full" onClick={onClose}>
              ¡Seguir estudiando!
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
