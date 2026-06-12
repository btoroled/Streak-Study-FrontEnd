import { Toaster } from 'sonner'

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        theme="dark"
        toastOptions={{
          style: {
            background: '#1e1f2a',
            border: '1px solid #2a2b38',
            color: '#f1f0f5',
          },
        }}
      />
    </>
  )
}
