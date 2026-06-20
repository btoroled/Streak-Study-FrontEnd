import { createBrowserRouter } from 'react-router-dom'
import PublicLayout from '@/layouts/PublicLayout'
import AppLayout from '@/layouts/AppLayout'

// Public pages
import LandingPage from '@/pages/public/LandingPage'
import LoginPage from '@/pages/public/LoginPage'
import RegisterPage from '@/pages/public/RegisterPage'
import ForgotPasswordPage from '@/pages/public/ForgotPasswordPage'
import ResetPasswordPage from '@/pages/public/ResetPasswordPage'

// App pages
import DashboardPage from '@/pages/app/DashboardPage'
import StudyPage from '@/pages/app/StudyPage'
import StudySessionPage from '@/pages/app/study/StudySessionPage'
import DecksPage from '@/pages/app/DecksPage'
import DeckDetailPage from '@/pages/app/decks/DeckDetailPage'
import DocumentsPage from '@/pages/app/DocumentsPage'
import CoursesPage from '@/pages/app/CoursesPage'
import AchievementsPage from '@/pages/app/AchievementsPage'
import StorePage from '@/pages/app/StorePage'
import LeaderboardPage from '@/pages/app/LeaderboardPage'
import ProfilePage from '@/pages/app/ProfilePage'

// Error pages
import Error403Page from '@/pages/errors/Error403Page'
import Error404Page from '@/pages/errors/Error404Page'
import Error500Page from '@/pages/errors/Error500Page'
import RouteErrorBoundary from '@/shared/components/feedback/RouteErrorBoundary'

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
  // Protected routes — AuthGuard handles session init + unauthenticated redirect
  {
    element: <AppLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/study', element: <StudyPage /> },
      { path: '/study/:deckId', element: <StudySessionPage /> },
      { path: '/decks', element: <DecksPage /> },
      { path: '/decks/:deckId', element: <DeckDetailPage /> },
      { path: '/documents', element: <DocumentsPage /> },
      { path: '/courses', element: <CoursesPage /> },
      { path: '/achievements', element: <AchievementsPage /> },
      { path: '/store', element: <StorePage /> },
      { path: '/leaderboard', element: <LeaderboardPage /> },
      { path: '/profile', element: <ProfilePage /> },
    ],
  },
  { path: '/403', element: <Error403Page /> },
  { path: '/404', element: <Error404Page /> },
  { path: '/500', element: <Error500Page /> },
  { path: '*', element: <Error404Page /> },
])
