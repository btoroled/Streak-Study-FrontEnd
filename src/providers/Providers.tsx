import { QueryProvider } from './QueryProvider'
import { ThemeProvider } from './ThemeProvider'
import { ToastProvider } from './ToastProvider'
import InstallPrompt from '@/shared/components/feedback/InstallPrompt'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <ToastProvider>
          {children}
          <InstallPrompt />
        </ToastProvider>
      </ThemeProvider>
    </QueryProvider>
  )
}
