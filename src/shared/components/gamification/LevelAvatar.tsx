import { cn } from '@/lib/cn'
import level1 from '@/assets/brand/levels/level-1.png'
import level2 from '@/assets/brand/levels/level-2.png'
import level3 from '@/assets/brand/levels/level-3.png'
import level4 from '@/assets/brand/levels/level-4.png'
import level5 from '@/assets/brand/levels/level-5.png'
import level6 from '@/assets/brand/levels/level-6.png'
import level7 from '@/assets/brand/levels/level-7.png'
import level8 from '@/assets/brand/levels/level-8.png'

const LEVEL_AVATARS: Record<number, string> = {
  1: level1, 2: level2, 3: level3, 4: level4,
  5: level5, 6: level6, 7: level7, 8: level8,
}

/** Devuelve el avatar de fénix correspondiente a un nivel (clamp 1..8). */
function getLevelAvatar(level: number): string {
  const clamped = Math.min(Math.max(level, 1), 8)
  return LEVEL_AVATARS[clamped] ?? level1
}

interface LevelAvatarProps {
  level: number
  /** Diámetro en px del avatar. */
  size?: number
  /** Muestra el número de nivel como badge en la esquina. */
  showBadge?: boolean
  className?: string
  alt?: string
}

export function LevelAvatar({
  level,
  size = 40,
  showBadge = false,
  className,
  alt,
}: LevelAvatarProps) {
  return (
    <div
      className={cn('relative shrink-0', className)}
      style={{ width: size, height: size }}
    >
      <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-[#1e1f2a] to-[#16171f] ring-2 ring-[#f97316]/40">
        <img
          src={getLevelAvatar(level)}
          alt={alt ?? `Nivel ${level}`}
          className="w-full h-full object-cover"
        />
      </div>
      {showBadge && (
        <span
          className="absolute -bottom-1 -right-1 flex items-center justify-center rounded-full bg-gradient-to-br from-[#f97316] to-[#7c3aed] text-white font-black ring-2 ring-[#16171f]"
          style={{ width: size * 0.45, height: size * 0.45, fontSize: size * 0.24 }}
        >
          {level}
        </span>
      )}
    </div>
  )
}
