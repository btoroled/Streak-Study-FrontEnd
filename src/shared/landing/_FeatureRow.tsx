import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface Props {
  eyebrow: string
  title: string
  children: ReactNode
  image: string
  imageAlt: string
  /** Invierte el orden imagen/texto en desktop para alternar filas. */
  reverse?: boolean
}

export default function FeatureRow({ eyebrow, title, children, image, imageAlt, reverse }: Props) {
  return (
    <div className={cn('flex flex-col md:flex-row items-center gap-8 md:gap-14', reverse && 'md:flex-row-reverse')}>
      <div className="flex-1 text-center md:text-left">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-orange mb-2">{eyebrow}</p>
        <h3 className="text-2xl font-black text-text-primary mb-3">{title}</h3>
        <div className="text-sm text-text-secondary leading-relaxed space-y-2">{children}</div>
      </div>
      <div className="flex-1 flex justify-center">
        <img src={image} alt={imageAlt} className="w-44 h-44 object-contain drop-shadow-2xl" />
      </div>
    </div>
  )
}
