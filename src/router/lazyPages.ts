import { lazy } from 'react'

// Code-splitting por ruta: cada página interna se carga bajo demanda.
// Exponemos también el `loader` (función de import dinámico) para poder hacer
// prefetch on hover desde la navegación.
const lazyPage = <T extends { default: React.ComponentType<unknown> }>(loader: () => Promise<T>) => {
  return {
    Component: lazy(loader),
    prefetch: loader,
  }
}

const dashboard    = lazyPage(() => import('@/pages/app/DashboardPage'))
const analytics    = lazyPage(() => import('@/pages/app/AnalyticsPage'))
const study        = lazyPage(() => import('@/pages/app/StudyPage'))
const studySession = lazyPage(() => import('@/pages/app/study/StudySessionPage'))
const decks        = lazyPage(() => import('@/pages/app/DecksPage'))
const deckDetail   = lazyPage(() => import('@/pages/app/decks/DeckDetailPage'))
const documents    = lazyPage(() => import('@/pages/app/DocumentsPage'))
const courses      = lazyPage(() => import('@/pages/app/CoursesPage'))
const achievements = lazyPage(() => import('@/pages/app/AchievementsPage'))
const store        = lazyPage(() => import('@/pages/app/StorePage'))
const leaderboard  = lazyPage(() => import('@/pages/app/LeaderboardPage'))
const profile      = lazyPage(() => import('@/pages/app/ProfilePage'))

export const DashboardPage = dashboard.Component
export const AnalyticsPage = analytics.Component
export const StudyPage = study.Component
export const StudySessionPage = studySession.Component
export const DecksPage = decks.Component
export const DeckDetailPage = deckDetail.Component
export const DocumentsPage = documents.Component
export const CoursesPage = courses.Component
export const AchievementsPage = achievements.Component
export const StorePage = store.Component
export const LeaderboardPage = leaderboard.Component
export const ProfilePage = profile.Component

/**
 * Mapa pathname → función de prefetch. Para usar en onMouseEnter de los links
 * de navegación: descarga el chunk antes de que el usuario haga clic.
 */
export const prefetchByPath: Record<string, () => Promise<unknown>> = {
  '/dashboard':    dashboard.prefetch,
  '/analytics':    analytics.prefetch,
  '/study':        study.prefetch,
  '/decks':        decks.prefetch,
  '/documents':    documents.prefetch,
  '/courses':      courses.prefetch,
  '/achievements': achievements.prefetch,
  '/store':        store.prefetch,
  '/leaderboard':  leaderboard.prefetch,
  '/profile':      profile.prefetch,
}
