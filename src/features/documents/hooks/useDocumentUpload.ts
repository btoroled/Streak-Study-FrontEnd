import { useMutation } from '@tanstack/react-query'
import { documentsService } from '@/services/documents.service'
import { getErrorMessage } from '@/lib/error.utils'
import type { DocumentUploadResponse } from '@/types/document.types'

/**
 * Sube un PDF al backend. Wrapper alrededor de useMutation para mantener
 * consistencia con el resto de la capa de datos (devtools, abort, retry).
 */
export function useDocumentUpload() {
  const mutation = useMutation<DocumentUploadResponse, unknown, File>({
    mutationFn: (file) => documentsService.upload(file),
  })

  const phase: 'idle' | 'uploading' | 'done' | 'error' = mutation.isPending
    ? 'uploading'
    : mutation.isSuccess
      ? 'done'
      : mutation.isError
        ? 'error'
        : 'idle'

  return {
    upload: (file: File) => mutation.mutate(file),
    reset: mutation.reset,
    result: mutation.data ?? null,
    error: mutation.error ? getErrorMessage(mutation.error, 'Error al subir el archivo') : null,
    phase,
  }
}
