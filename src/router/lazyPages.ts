import { lazy } from 'react'

// Code-splitting por ruta: cada página interna se carga bajo demanda.
export const DashboardPage = lazy(() => import('@/pages/app/DashboardPage'))
export const AnalyticsPage = lazy(() => import('@/pages/app/AnalyticsPage'))
export const StudyPage = lazy(() => import('@/pages/app/StudyPage'))
export const StudySessionPage = lazy(() => import('@/pages/app/study/StudySessionPage'))
export const DecksPage = lazy(() => import('@/pages/app/DecksPage'))
export const DeckDetailPage = lazy(() => import('@/pages/app/decks/DeckDetailPage'))
export const DocumentsPage = lazy(() => import('@/pages/app/DocumentsPage'))
export const CoursesPage = lazy(() => import('@/pages/app/CoursesPage'))
export const AchievementsPage = lazy(() => import('@/pages/app/AchievementsPage'))
export const StorePage = lazy(() => import('@/pages/app/StorePage'))
export const LeaderboardPage = lazy(() => import('@/pages/app/LeaderboardPage'))
export const ProfilePage = lazy(() => import('@/pages/app/ProfilePage'))
