import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import PdfUploadZone from '@/features/documents/components/PdfUploadZone'
import DuplicateAlert from '@/features/documents/components/DuplicateAlert'
import DocumentStatusCard from '@/features/documents/components/DocumentStatusCard'
import GenerateFlashcardsForm from '@/features/documents/components/GenerateFlashcardsForm'
import JobStatusCard from '@/features/documents/components/JobStatusCard'
import MarkdownPreview from '@/features/documents/components/MarkdownPreview'
import { useDocumentUpload } from '@/features/documents/hooks/useDocumentUpload'
import { useDocumentStatusPolling } from '@/features/documents/hooks/useDocumentStatusPolling'
import { useAiJobPolling } from '@/features/documents/hooks/useAiJobPolling'
import { documentsService } from '@/services/documents.service'
import { toast } from 'sonner'

export default function DocumentsPage() {
  const { phase, result, error: uploadError, upload, reset } = useDocumentUpload()
  const [jobId, setJobId] = useState<number | null>(null)
  const [ignoreDuplicate, setIgnoreDuplicate] = useState(false)

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

  const handleFile = (file: File) => upload(file)

  const isDuplicate = result?.duplicate && !ignoreDuplicate

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Documentos IA</h1>
        <p className="text-sm text-white/50 mt-0.5">
          Sube un PDF para extraer contenido y generar flashcards con IA
        </p>
      </div>

      {phase === 'idle' && (
        <PdfUploadZone onFile={handleFile} />
      )}

      {phase === 'uploading' && (
        <PdfUploadZone onFile={handleFile} isLoading />
      )}

      {phase === 'error' && (
        <div className="text-center space-y-3 py-8">
          <p className="text-sm text-red-400">{uploadError}</p>
          <button className="text-xs text-white/50 hover:text-white" onClick={reset}>Intentar de nuevo</button>
        </div>
      )}

      {phase === 'done' && result && (
        <div className="space-y-4">
          {isDuplicate ? (
            <DuplicateAlert
              filename={result.originalFilename}
              onContinue={() => setIgnoreDuplicate(true)}
              onCancel={reset}
            />
          ) : (
            <>
              {docStatus && <DocumentStatusCard doc={docStatus} />}

              {docStatus?.markdownAvailable && (
                <MarkdownPreview documentId={result.documentId} />
              )}

              {docStatus && (
                <GenerateFlashcardsForm
                  doc={docStatus}
                  onGenerate={(deckId) => generateMutation.mutateAsync({ deckId }).then(() => {})}
                  isLoading={generateMutation.isPending}
                />
              )}

              {job && <JobStatusCard job={job} />}

              <button className="text-xs text-white/30 hover:text-white/60 transition-colors" onClick={reset}>
                ← Subir otro documento
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
