import { useMutation } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Loader2 } from 'lucide-react'
import { flashcardsService } from '@/services/flashcards.service'

interface Props {
  flashcardId: number
}

/** Botón "Explícame" que pide al tutor IA una explicación del concepto. */
export default function ExplainButton({ flashcardId }: Props) {
  const explain = useMutation({
    mutationFn: () => flashcardsService.explain(flashcardId),
  })

  return (
    <div>
      <button
        onClick={() => explain.mutate()}
        disabled={explain.isPending}
        className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium border border-[#7c3aed]/40 text-[#a78bfa] hover:bg-[#7c3aed]/10 transition-colors disabled:opacity-50"
      >
        {explain.isPending ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Pensando…</>
        ) : (
          <><Sparkles className="w-4 h-4" /> Explícame este concepto</>
        )}
      </button>

      <AnimatePresence>
        {explain.data && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 p-4 rounded-xl bg-[#7c3aed]/8 border border-[#7c3aed]/25">
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#a78bfa]" />
                <span className="text-xs font-semibold text-[#a78bfa]">Tutor IA</span>
              </div>
              <p className="text-sm text-white/80 leading-relaxed">{explain.data}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {explain.isError && (
        <p className="mt-2 text-xs text-red-400 text-center">
          No se pudo obtener la explicación. Intenta de nuevo.
        </p>
      )}
    </div>
  )
}
