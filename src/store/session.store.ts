import { create } from 'zustand'

type SessionStatus = 'idle' | 'loading' | 'ready' | 'error'

interface SessionState {
  status: SessionStatus
  setStatus: (status: SessionStatus) => void
}

export const useSessionStore = create<SessionState>((set) => ({
  status: 'idle',
  setStatus: (status) => set({ status }),
}))
