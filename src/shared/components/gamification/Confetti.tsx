import { useState } from 'react'
import { motion } from 'framer-motion'

const COLORS = ['#f97316', '#7c3aed', '#a78bfa', '#f9a366', '#fbbf24', '#ec4899']

interface Piece {
  id: number
  left: number
  color: string
  delay: number
  rotate: number
  size: number
  drift: number
}

interface ConfettiProps {
  /** Número de partículas. */
  count?: number
  /** Duración de la caída en segundos. */
  duration?: number
}

/**
 * Lluvia de confeti ligera basada en framer-motion. Se posiciona en `absolute`
 * cubriendo el contenedor relativo más cercano (pointer-events: none).
 */
export default function Confetti({ count = 40, duration = 2.8 }: ConfettiProps) {
  // Inicializador lazy de useState: la aleatoriedad se calcula una sola vez
  // al montar, no en cada render.
  const [pieces] = useState<Piece[]>(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: COLORS[i % COLORS.length],
      delay: Math.random() * 0.6,
      rotate: Math.random() * 360,
      size: 6 + Math.random() * 6,
      drift: (Math.random() - 0.5) * 120,
    }))
  )

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: 0, opacity: 1, rotate: 0 }}
          animate={{ y: '110%', x: p.drift, opacity: [1, 1, 0], rotate: p.rotate }}
          transition={{ duration, delay: p.delay, ease: 'easeIn' }}
          style={{
            position: 'absolute',
            top: 0,
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 1.4,
            backgroundColor: p.color,
            borderRadius: 2,
          }}
        />
      ))}
    </div>
  )
}
