export interface LevelInfo {
  level: number
  name: string
  xpRequired: number
}

export interface UserLevel extends LevelInfo {
  xp: number
  xpToNext: number
  progress: number  // 0-1
}
