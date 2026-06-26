import AuthGuard from '@/shared/components/guards/AuthGuard'

export default function AppLayout() {
  return <AuthGuard />
}
