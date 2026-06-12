export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f0f14] gap-4">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-2 border-[#2a2b38]" />
        <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-transparent border-t-[#f97316] animate-spin" />
      </div>
      <p className="text-sm text-[#5e5c70]">Cargando StreakStudy…</p>
    </div>
  )
}
