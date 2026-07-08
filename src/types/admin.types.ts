import type { UserRole } from '@/config/roles'

// Agregados de plataforma para el dashboard de SUPER_ADMIN (Issue B.10).
export interface AdminStatsResponse {
  totalUsers: number
  activeUsers: number
  totalInstitutions: number
  totalDecks: number
  totalFlashcards: number
  totalReviews: number
  aiTokensUsed: number
  usersByRole: Partial<Record<UserRole, number>>
}

export interface InstitutionStatsRow {
  institutionId: number
  name: string
  users: number
  decks: number
  reviews: number
}
