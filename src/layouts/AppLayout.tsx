import AuthGuard from '@/shared/components/guards/AuthGuard'

// Phase 4 will add Sidebar + TopBar inside here.
// AuthGuard handles session init, loading state, and unauthenticated redirects.
export default function AppLayout() {
  return <AuthGuard />
}
