import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserRole } from '@/config/roles'
import type { UserProgressResponse } from '@/types/user.types'

interface AuthState {
  // ── In-memory only (never persisted — security) ──
  accessToken: string | null

  // ── Persisted via localStorage ──
  refreshToken: string | null
  userId: number | null
  institutionId: number | null
  email: string | null
  fullName: string | null
  role: UserRole | null

  // ── Progress (source of truth: GET /progress, snapshot persisted) ──
  xp: number
  currentStreak: number
  streakFreezes: number
  badges: string[]

  // ── Actions ──
  setAuth: (payload: {
    accessToken: string
    refreshToken: string
    userId: number
    institutionId: number
    email: string
    fullName?: string
    role: UserRole
    xp: number
  }) => void
  setAccessToken: (token: string) => void
  setProgress: (progress: UserProgressResponse) => void
  logout: () => void
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      userId: null,
      institutionId: null,
      email: null,
      fullName: null,
      role: null,
      xp: 0,
      currentStreak: 0,
      streakFreezes: 0,
      badges: [],

      setAuth: (payload) =>
        set((state) => ({
          accessToken: payload.accessToken,
          refreshToken: payload.refreshToken,
          userId: payload.userId,
          institutionId: payload.institutionId,
          email: payload.email,
          // keep persisted fullName when login doesn't provide it (no GET /auth/me)
          fullName: payload.fullName ?? state.fullName,
          role: payload.role,
          xp: payload.xp,
        })),

      setAccessToken: (token) => set({ accessToken: token }),

      setProgress: (progress) =>
        set({
          xp: progress.xp,
          currentStreak: progress.currentStreak,
          streakFreezes: progress.streakFreezes,
          badges: progress.badges,
        }),

      logout: () =>
        set({
          accessToken: null,
          refreshToken: null,
          userId: null,
          institutionId: null,
          email: null,
          fullName: null,
          role: null,
          xp: 0,
          currentStreak: 0,
          streakFreezes: 0,
          badges: [],
        }),

      isAuthenticated: () => get().refreshToken !== null,
    }),
    {
      name: 'streakstudy-auth',
      partialize: (state) => ({
        refreshToken: state.refreshToken,
        userId: state.userId,
        institutionId: state.institutionId,
        email: state.email,
        fullName: state.fullName,
        role: state.role,
        xp: state.xp,
        currentStreak: state.currentStreak,
        streakFreezes: state.streakFreezes,
        badges: state.badges,
      }),
    }
  )
)
