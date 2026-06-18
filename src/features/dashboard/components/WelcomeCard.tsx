import { useDashboard } from '../hooks/useDashboard'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Buenos días'
  if (h < 19) return 'Buenas tardes'
  return 'Buenas noches'
}

export default function WelcomeCard() {
  const { displayName, currentStreak } = useDashboard()
  const mascot = currentStreak >= 7 ? '🔥' : currentStreak >= 3 ? '⚡' : '📚'
  return (
    <div className="bg-gradient-to-r from-[#f97316]/10 to-[#7c3aed]/10 border border-[#2a2b38] rounded-xl p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[#9896a8]">{greeting()}</p>
          <h2 className="text-xl font-bold text-[#f1f0f5] mt-0.5">{displayName} {mascot}</h2>
          {currentStreak > 0 ? (
            <p className="text-sm text-[#f97316] mt-1 font-medium flex items-center gap-1">
              <span className="inline-block animate-[flame-flicker_1.1s_ease-in-out_infinite]">🔥</span>
              {currentStreak} {currentStreak === 1 ? 'día' : 'días'} de racha — ¡sigue así!
            </p>
          ) : (
            <p className="text-sm text-[#9896a8] mt-1">Empieza tu racha hoy estudiando.</p>
          )}
        </div>
        <div className="text-4xl select-none">{mascot}</div>
      </div>
    </div>
  )
}
