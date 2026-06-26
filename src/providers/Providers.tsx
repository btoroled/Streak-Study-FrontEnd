import { QueryProvider } from './QueryProvider'
import { ThemeProvider } from './ThemeProvider'
import { ToastProvider } from './ToastProvider'
import { SessionInitProvider } from './SessionInitProvider'
import InstallPrompt from '@/shared/components/feedback/InstallPrompt'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <ToastProvider>
          <SessionInitProvider>
            {children}
            <InstallPrompt />
          </SessionInitProvider>
        </ToastProvider>
      </ThemeProvider>
    </QueryProvider>
  )
}
