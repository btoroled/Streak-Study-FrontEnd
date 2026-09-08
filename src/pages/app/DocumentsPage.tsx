import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import PdfUploadZone from '@/features/documents/components/PdfUploadZone'
import DuplicateAlert from '@/features/documents/components/DuplicateAlert'
import DocumentStatusCard from '@/features/documents/components/DocumentStatusCard'
import GenerateFlashcardsForm from '@/features/documents/components/GenerateFlashcardsForm'
import JobStatusCard from '@/features/documents/components/JobStatusCard'
import MarkdownPreview from '@/features/documents/components/MarkdownPreview'
import WizardSteps from '@/features/documents/components/WizardSteps'
import { useDocumentUpload } from '@/features/documents/hooks/useDocumentUpload'
import { useDocumentStatusPolling } from '@/features/documents/hooks/useDocumentStatusPolling'
import { useAiJobPolling } from '@/features/documents/hooks/useAiJobPolling'
import { deriveWizardStep } from '@/features/documents/utils/wizard.utils'
import { documentsService } from '@/services/documents.service'
import { ROUTES } from '@/config/routes'
import { Button } from '@/shared/components/ui/button'
import { toast } from 'sonner'

export default function DocumentsPage() {
  const navigate = useNavigate()
  const { phase, result, error: uploadError, upload, reset } = useDocumentUpload()
  const [jobId, setJobId] = useState<number | null>(null)
  const [ignoreDuplicate, setIgnoreDuplicate] = useState(false)
  const [markdownConfirmed, setMarkdownConfirmed] = useState(false)

  const docId = result?.documentId ?? null
  const { data: docStatus } = useDocumentStatusPolling(docId)
  const { data: job } = useAiJobPolling(jobId)

  const generateMutation = useMutation({
    mutationFn: ({ deckId }: { deckId: number }) =>
      documentsService.generateFlashcards(docId!, { deckId }),
    onSuccess: (data) => {
      setJobId(data.jobId)
      toast.success('Generación iniciada')
    },
    onError: () => toast.error('No se pudo iniciar la generación'),
  })

  const restart = () => {
    setJobId(null)
    setIgnoreDuplicate(false)
    setMarkdownConfirmed(false)
    reset()
  }

  const step = deriveWizardStep({
    uploadPhase: phase,
    isDuplicatePending: Boolean(result?.duplicate && !ignoreDuplicate),
    markdownConfirmed,
    jobStatus: job?.status ?? null,
  })

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-text-primary">Documentos IA</h1>
        <p className="text-sm text-text-secondary mt-0.5">
          Sube un PDF, revisa el contenido extraído y genera flashcards con IA
        </p>
      </div>

      <WizardSteps current={step} />

      {/* Paso 1 — Subir PDF */}
      {step === 1 && (
        <div className="space-y-4">
          {(phase === 'idle' || phase === 'uploading') && (
            <PdfUploadZone onFile={upload} isLoading={phase === 'uploading'} />
          )}

          {phase === 'error' && (
            <div className="text-center space-y-3 py-8">
              <p className="text-sm text-error">{uploadError}</p>
              <button className="text-xs text-text-muted hover:text-text-primary" onClick={restart}>
                Intentar de nuevo
              </button>
            </div>
          )}

          {phase === 'done' && result?.duplicate && !ignoreDuplicate && (
            <DuplicateAlert
              filename={result.originalFilename}
              onContinue={() => setIgnoreDuplicate(true)}
              onCancel={restart}
            />
          )}
        </div>
      )}

      {/* Paso 2 — Revisar markdown extraído */}
      {step === 2 && result && (
        <div className="space-y-4">
          {docStatus && <DocumentStatusCard doc={docStatus} />}
          {docStatus?.markdownAvailable && <MarkdownPreview documentId={result.documentId} />}

          <div className="flex items-center justify-between">
            <button className="text-xs text-text-muted hover:text-text-secondary transition-colors" onClick={restart}>
              ← Subir otro documento
            </button>
            <Button
              onClick={() => setMarkdownConfirmed(true)}
              disabled={!docStatus?.markdownAvailable}
            >
              Continuar
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
          {docStatus && !docStatus.markdownAvailable
            && docStatus.status !== 'FAILED'
            && docStatus.status !== 'OCR_REQUIRED' && (
            <p className="text-xs text-text-muted">Extrayendo contenido del PDF…</p>
          )}
          {docStatus?.status === 'OCR_REQUIRED' && (
            <div className="rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-3">
              <p className="text-sm font-medium text-amber-300">
                Este PDF contiene texto dentro de imágenes
              </p>
              <p className="mt-1 text-xs text-text-secondary">
                Todavía no podemos leer suficiente contenido con precisión. Exporta una versión
                con texto seleccionable o sube otro documento mientras incorporamos OCR.
              </p>
            </div>
          )}
          {docStatus?.status === 'FAILED' && (
            <p className="text-xs text-error">No se pudo procesar el PDF. Sube otro documento.</p>
          )}
        </div>
      )}

      {/* Paso 3 — Generar flashcards */}
      {step === 3 && docStatus && (
        <div className="space-y-4">
          <GenerateFlashcardsForm
            doc={docStatus}
            onGenerate={(deckId) => generateMutation.mutateAsync({ deckId }).then(() => {})}
            isLoading={generateMutation.isPending}
          />
          {job && <JobStatusCard job={job} />}
          <button className="text-xs text-text-muted hover:text-text-secondary transition-colors" onClick={restart}>
            ← Subir otro documento
          </button>
        </div>
      )}

      {/* Paso 4 — Listo: ver el mazo */}
      {step === 4 && job && (
        <div className="text-center space-y-4 py-8">
          <CheckCircle2 className="w-12 h-12 text-success mx-auto" />
          <div>
            <p className="text-base font-semibold text-text-primary">¡Flashcards generadas!</p>
            <p className="text-sm text-text-secondary mt-1">
              Tus tarjetas ya están en el mazo, listas para estudiar.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3">
            <Button onClick={() => navigate(ROUTES.DECK_DETAIL(job.deckId))}>
              Ver mazo
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
            <button className="text-xs text-text-muted hover:text-text-secondary transition-colors" onClick={restart}>
              Subir otro documento
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
