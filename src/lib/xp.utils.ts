import type { LevelInfo, UserLevel } from '@/types/gamification.types'

export const LEVELS: LevelInfo[] = [
  { level: 1, name: 'Llama Curiosa',    xpRequired: 0    },
  { level: 2, name: 'Llama Dedicada',   xpRequired: 50   },
  { level: 3, name: 'Llama Constante',  xpRequired: 150  },
  { level: 4, name: 'Llama Enfocada',   xpRequired: 300  },
  { level: 5, name: 'Llama Brillante',  xpRequired: 500  },
  { level: 6, name: 'Llama Sabia',      xpRequired: 800  },
  { level: 7, name: 'Llama Maestra',    xpRequired: 1200 },
  { level: 8, name: 'Llama Legendaria', xpRequired: 2000 },
]

export function getUserLevel(xp: number): UserLevel {
  let current = LEVELS[0]
  let next: LevelInfo | undefined

  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xpRequired) {
      current = LEVELS[i]
      next = LEVELS[i + 1]
      break
    }
  }

  const xpInLevel = next ? xp - current.xpRequired : 0
  const xpToNext = next ? next.xpRequired - current.xpRequired : 0
  const progress = next && xpToNext > 0 ? xpInLevel / xpToNext : 1

  return {
    ...current,
    xp,
    xpToNext: next ? next.xpRequired - xp : 0,
    progress: Math.min(1, progress),
  }
}

export function calcXpGain(reviewedCards: number, durationMinutes: number): number {
  return reviewedCards + Math.floor(durationMinutes / 10)
}
