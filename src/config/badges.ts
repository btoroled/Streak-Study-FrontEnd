export interface BadgeDefinition {
  id: string
  name: string
  description: string
  icon: string          // lucide icon name
  xpCost: number
  category: 'purchase' | 'automatic'
  isAvailable: boolean
}

export const BADGE_CATALOG: BadgeDefinition[] = [
  {
    id: 'STREAK_STARTER',
    name: 'Streak Starter',
    description: 'Demuestra tu compromiso con el estudio constante.',
    icon: 'Flame',
    xpCost: 7,
    category: 'purchase',
    isAvailable: true,
  },
  {
    id: 'XP_COLLECTOR',
    name: 'XP Collector',
    description: 'Coleccionas experiencia como un verdadero estudiante.',
    icon: 'Star',
    xpCost: 7,
    category: 'purchase',
    isAvailable: true,
  },
]

export const BADGE_MAP = Object.fromEntries(
  BADGE_CATALOG.map((b) => [b.id, b])
) as Record<string, BadgeDefinition>
