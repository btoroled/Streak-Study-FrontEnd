export const FEATURES = {
  LEADERBOARD: import.meta.env.VITE_FEATURE_LEADERBOARD === 'true',
  INSTITUTIONS_LIST: import.meta.env.VITE_FEATURE_INSTITUTIONS_LIST === 'true',
} as const

export type FeatureFlag = keyof typeof FEATURES
