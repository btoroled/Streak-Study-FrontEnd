import FeatureRow from './_FeatureRow'
import mascotCelebrate from '@/assets/brand/mascot-celebrate.png'

export default function GamificationSection() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-14">
      <FeatureRow
        eyebrow="Gamificación que engancha"
        title="Rachas, XP y 8 niveles de fénix"
        image={mascotCelebrate}
        imageAlt="Mascota celebrando"
      >
        <p>
          Cada sesión suma XP y extiende tu racha. Sube de nivel, desbloquea
          logros y compite en el ranking de tu institución.
        </p>
        <p>¿Un día imposible? Los protectores de racha te cubren.</p>
      </FeatureRow>
    </section>
  )
}
