import { Toaster } from 'sonner'
import { useTheme } from 'next-themes'

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme()

  return (
    <>
      {children}
      <Toaster
        position="top-right"
        theme={resolvedTheme === 'light' ? 'light' : 'dark'}
        toastOptions={{
          style: {
            background: 'var(--color-surface-overlay)',
            border: '1px solid var(--color-surface-border)',
            color: 'var(--color-text-primary)',
          },
        }}
      />
    </>
  )
}
