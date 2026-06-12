import { motion } from 'framer-motion'

interface Props {
  current: number
  total: number
}

export default function StudyProgressBar({ current, total }: Props) {
  const pct = total > 0 ? (current / total) * 100 : 0

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs text-white/40">
        <span>{current} de {total}</span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-orange-500 to-purple-600 rounded-full"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  )
}
