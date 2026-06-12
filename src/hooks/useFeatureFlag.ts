import { FEATURES, type FeatureFlag } from '@/config/featureFlags'

export function useFeatureFlag(flag: FeatureFlag): boolean {
  return FEATURES[flag]
}
