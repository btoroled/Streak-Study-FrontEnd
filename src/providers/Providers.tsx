import { QueryProvider } from './QueryProvider'
import { ThemeProvider } from './ThemeProvider'
import { ToastProvider } from './ToastProvider'
import { SessionInitProvider } from './SessionInitProvider'
import InstallPrompt from '@/shared/components/feedback/InstallPrompt'
import UpdatePrompt from '@/shared/components/feedback/UpdatePrompt'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <ToastProvider>
          <SessionInitProvider>
            {children}
          </SessionInitProvider>
          <InstallPrompt />
          <UpdatePrompt />
        </ToastProvider>
      </ThemeProvider>
    </QueryProvider>
  )
}
