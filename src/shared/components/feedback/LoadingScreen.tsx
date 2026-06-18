import logoMark from '@/assets/brand/logo-mark.png'

interface LoadingScreenProps {
  /** Texto bajo la mascota. */
  message?: string
}

export default function LoadingScreen({ message = 'Cargando StreakStudy…' }: LoadingScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f0f14] gap-5">
      <div className="relative flex items-center justify-center">
        {/* glow pulsante detrás del fénix */}
        <div
          className="absolute w-32 h-32 rounded-full blur-3xl opacity-40 animate-[pulse-glow_1.8s_ease-in-out_infinite]"
          style={{ background: 'radial-gradient(circle, #f97316 0%, #7c3aed 70%, transparent 100%)' }}
        />
        <img
          src={logoMark}
          alt="StreakStudy"
          className="relative w-24 h-24 object-contain drop-shadow-2xl animate-[float_2.4s_ease-in-out_infinite]"
        />
      </div>

      {/* puntos de progreso */}
      <div className="flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-[#f97316] animate-[bounce-dot_1.2s_ease-in-out_infinite]"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>

      <p className="text-sm text-[#5e5c70]">{message}</p>
    </div>
  )
}
