import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/shared/components/ui/button'
import Confetti from '@/shared/components/gamification/Confetti'
import XpGainAnimation from './XpGainAnimation'
import mascotCelebrate from '@/assets/brand/mascot-celebrate.png'

interface Props {
  total: number
  xpGained: number
  deckId: number
  streakExtended?: number | null
  onRestart: () => void
}

export default function StudyComplete({ total, xpGained, deckId, streakExtended, onRestart }: Props) {
  const navigate = useNavigate()

  return (
    <div className="relative flex flex-col items-center gap-6 py-10 text-center overflow-hidden">
      <Confetti />

      <motion.img
        src={mascotCelebrate}
        alt="¡Sesión completada!"
        initial={{ scale: 0.4, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        className="w-32 h-32 object-contain drop-shadow-2xl"
      />
      <div>
        <h2 className="text-xl font-bold text-white">¡Sesión completada!</h2>
        <p className="text-white/50 text-sm mt-1">Repasaste {total} flashcard{total !== 1 ? 's' : ''}</p>
      </div>

      <XpGainAnimation xp={xpGained} />

      {streakExtended != null && streakExtended > 0 && (
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 280, damping: 18, delay: 0.15 }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#f97316]/12 border border-[#f97316]/25"
        >
          <span className="text-xl animate-[flame-flicker_1.1s_ease-in-out_infinite]">🔥</span>
          <span className="text-sm font-semibold text-[#f97316]">
            ¡Racha de {streakExtended} {streakExtended === 1 ? 'día' : 'días'}!
          </span>
        </motion.div>
      )}

      <div className="flex gap-3 w-full max-w-xs">
        <Button variant="outline" className="flex-1" onClick={() => navigate(`/decks/${deckId}`)}>
          Ver mazo
        </Button>
        <Button className="flex-1" onClick={onRestart}>
          Repetir
        </Button>
      </div>

      <button
        className="text-xs text-white/30 hover:text-white/60 transition-colors"
        onClick={() => navigate('/study')}
      >
        Estudiar otro mazo →
      </button>
    </div>
  )
}
