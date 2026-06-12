import { useState } from 'react'
import { documentsService } from '@/services/documents.service'
import type { DocumentUploadResponse } from '@/types/document.types'

type UploadPhase = 'idle' | 'uploading' | 'done' | 'error'

export function useDocumentUpload() {
  const [phase, setPhase] = useState<UploadPhase>('idle')
  const [result, setResult] = useState<DocumentUploadResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const upload = async (file: File) => {
    setPhase('uploading')
    setError(null)
    try {
      const data = await documentsService.upload(file)
      setResult(data)
      setPhase('done')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al subir el archivo'
      setError(msg)
      setPhase('error')
    }
  }

  const reset = () => {
    setPhase('idle')
    setResult(null)
    setError(null)
  }

  return { phase, result, error, upload, reset }
}
