import { Flame, Zap, Brain, Trophy } from 'lucide-react'

const features = [
  { icon: Flame, text: 'Rachas diarias que te mantienen motivado' },
  { icon: Zap, text: 'Flashcards generadas por IA desde tus PDFs' },
  { icon: Brain, text: 'Aprende más en menos tiempo' },
  { icon: Trophy, text: 'Compite en el ranking de tu institución' },
]

export function AuthBrandPanel() {
  return (
    <div className="hidden lg:flex flex-col justify-between w-[460px] shrink-0 bg-[#16171f] border-r border-[#2a2b38] p-12">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#f97316] to-[#7c3aed] flex items-center justify-center">
          <Flame className="w-4 h-4 text-white" />
        </div>
        <span className="text-lg font-bold text-[#f1f0f5]">StreakStudy</span>
      </div>

      {/* Center content */}
      <div className="space-y-8">
        {/* Tagline */}
        <div>
          <h2 className="text-3xl font-bold text-[#f1f0f5] leading-tight">
            Learn.{' '}
            <span className="bg-gradient-to-r from-[#f97316] to-[#7c3aed] bg-clip-text text-transparent">
              Streak.
            </span>{' '}
            Grow.
          </h2>
          <p className="text-[#9896a8] mt-2 text-sm leading-relaxed">
            La plataforma que convierte el estudio diario en un hábito que no quieres romper.
          </p>
        </div>

        {/* Streak counter */}
        <div className="flex items-center gap-4 p-4 rounded-xl bg-[#1e1f2a] border border-[#2a2b38]">
          <div className="text-4xl font-black text-[#f97316]">🔥</div>
          <div>
            <p className="text-2xl font-bold text-[#f1f0f5]">247</p>
            <p className="text-xs text-[#9896a8]">días de racha máxima en la plataforma</p>
          </div>
        </div>

        {/* Features */}
        <ul className="space-y-3">
          {features.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3 text-sm text-[#9896a8]">
              <div className="w-7 h-7 rounded-md bg-[#1e1f2a] border border-[#2a2b38] flex items-center justify-center shrink-0">
                <Icon className="w-3.5 h-3.5 text-[#a78bfa]" />
              </div>
              {text}
            </li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <p className="text-xs text-[#5e5c70]">
        StreakStudy · Plataforma educativa gamificada
      </p>
    </div>
  )
}
