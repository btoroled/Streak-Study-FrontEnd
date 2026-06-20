export interface UserStats {
  xp: number
  currentStreak: number
  totalReviews: number
  masteredCards: number
  dueToday: number
}

export interface ActivityPoint {
  date: string   // ISO date (yyyy-MM-dd)
  reviews: number
}

export interface ForecastPoint {
  date: string
  due: number
}
