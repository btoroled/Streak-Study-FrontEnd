import { motion } from 'framer-motion'
import type { FlashcardResponse } from '@/types/flashcard.types'

interface Props {
  card: FlashcardResponse
  flipped: boolean
  onFlip: () => void
}

export default function FlashcardFlip({ card, flipped, onFlip }: Props) {
  return (
    <div
      className="relative cursor-pointer select-none"
      style={{ perspective: 1200 }}
      onClick={onFlip}
    >
      <motion.div
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.45, ease: 'easeInOut' }}
        className="relative w-full"
      >
        {/* Front */}
        <div
          className="w-full min-h-52 bg-surface-card border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <span className="text-xs font-medium text-white/35 uppercase tracking-widest mb-4">Pregunta</span>
          <p className="text-lg font-semibold text-white leading-relaxed">{card.question}</p>
          <p className="text-xs text-white/30 mt-6">Toca para ver la respuesta</p>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 w-full min-h-52 bg-surface-overlay border border-orange-500/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <span className="text-xs font-medium text-orange-400/60 uppercase tracking-widest mb-4">Respuesta</span>
          <p className="text-lg text-white/90 leading-relaxed">{card.answer}</p>
        </div>
      </motion.div>
    </div>
  )
}
