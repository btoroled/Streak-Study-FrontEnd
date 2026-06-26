import { createBrowserRouter } from 'react-router-dom'
import PublicLayout from '@/layouts/PublicLayout'
import AppLayout from '@/layouts/AppLayout'

// Public pages — sin lazy loading, para first-paint instantáneo en login/landing
import LandingPage from '@/pages/public/LandingPage'
import LoginPage from '@/pages/public/LoginPage'
import RegisterPage from '@/pages/public/RegisterPage'
import ForgotPasswordPage from '@/pages/public/ForgotPasswordPage'
import ResetPasswordPage from '@/pages/public/ResetPasswordPage'

// App pages — lazy: code-splitting por ruta, cargan bajo demanda
import {
  DashboardPage,
  AnalyticsPage,
  StudyPage,
  StudySessionPage,
  DecksPage,
  DeckDetailPage,
  DocumentsPage,
  CoursesPage,
  AchievementsPage,
  StorePage,
  LeaderboardPage,
  ProfilePage,
} from './lazyPages'

// Error pages
import Error403Page from '@/pages/errors/Error403Page'
import Error404Page from '@/pages/errors/Error404Page'
import Error500Page from '@/pages/errors/Error500Page'
import RouteErrorBoundary from '@/shared/components/feedback/RouteErrorBoundary'
import RoleGuard from '@/shared/components/guards/RoleGuard'

export const router = createBrowserRouter([
  // Public routes — GuestGuard redirects authenticated users to /dashboard
  {
    element: <PublicLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { path: '/', element: <LandingPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
      { path: '/reset-password', element: <ResetPasswordPage /> },
    ],
  },
  // Protected routes — AuthGuard observa el status hidratado por SessionInitProvider
  {
    element: <AppLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/analytics', element: <AnalyticsPage /> },
      { path: '/study', element: <StudyPage /> },
      { path: '/study/:deckId', element: <StudySessionPage /> },
      { path: '/decks', element: <DecksPage /> },
      { path: '/decks/:deckId', element: <DeckDetailPage /> },
      { path: '/documents', element: <DocumentsPage /> },
      { path: '/courses', element: <CoursesPage /> },
      { path: '/achievements', element: <AchievementsPage /> },
      {
        path: '/store',
        element: (
          <RoleGuard permission="view:store">
            <StorePage />
          </RoleGuard>
        ),
      },
      { path: '/leaderboard', element: <LeaderboardPage /> },
      { path: '/profile', element: <ProfilePage /> },
    ],
  },
  { path: '/403', element: <Error403Page /> },
  { path: '/404', element: <Error404Page /> },
  { path: '/500', element: <Error500Page /> },
  { path: '*', element: <Error404Page /> },
])
