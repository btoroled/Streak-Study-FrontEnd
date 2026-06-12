import { motion } from 'framer-motion'

interface Props {
  xp: number
}

export default function XpGainAnimation({ xp }: Props) {
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="flex flex-col items-center gap-1"
    >
      <div className="text-5xl font-black bg-gradient-to-r from-orange-400 to-purple-400 bg-clip-text text-transparent">
        +{xp}
      </div>
      <div className="text-sm text-white/50 font-medium">XP ganado</div>
    </motion.div>
  )
}
