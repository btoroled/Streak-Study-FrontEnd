export interface BadgePurchaseRequest {
  badgeName: string
}

export interface BadgeDefinition {
  id: string
  name: string
  description: string
  icon: string
  xpCost: number
  category: 'purchase' | 'automatic'
  isAvailable: boolean
}

export interface UserBadge {
  id: string
  name: string
  source: 'purchase' | 'automatic'
  unlockedAt?: string
}
