export const ROUTES = {
  // Public
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  // App
  DASHBOARD: '/dashboard',
  STUDY: '/study',
  STUDY_SESSION: (deckId: number | string) => `/study/${deckId}`,
  DECKS: '/decks',
  DECK_DETAIL: (deckId: number | string) => `/decks/${deckId}`,
  DOCUMENTS: '/documents',
  COURSES: '/courses',
  ACHIEVEMENTS: '/achievements',
  STORE: '/store',
  LEADERBOARD: '/leaderboard',
  PROFILE: '/profile',
  // Errors
  FORBIDDEN: '/403',
  NOT_FOUND: '/404',
  SERVER_ERROR: '/500',
} as const
