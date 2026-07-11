import logoMark from '@/assets/brand/logo-mark.png'

export default function FooterSection() {
  return (
    <footer className="border-t border-surface-border">
      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <img src={logoMark} alt="StreakStudy" className="w-6 h-6 object-contain" />
          <span className="text-sm font-bold text-text-primary">StreakStudy</span>
        </div>
        <div className="flex items-center gap-5 text-xs text-text-muted">
          <a href="#como-funciona" className="hover:text-text-secondary transition-colors">Cómo funciona</a>
          <a href="#precios" className="hover:text-text-secondary transition-colors">Precios</a>
          <a href="#contacto" className="hover:text-text-secondary transition-colors">Contacto</a>
        </div>
        <p className="text-xs text-text-muted">© {new Date().getFullYear()} StreakStudy</p>
      </div>
    </footer>
  )
}
