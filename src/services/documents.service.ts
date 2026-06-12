import api from './api.client'
import type { DocumentUploadResponse, DocumentStatusResponse, GenerateFlashcardsRequest, AiGenerationJobResponse } from '@/types/document.types'
import type { FlashcardResponse } from '@/types/flashcard.types'

export const documentsService = {
  upload: (file: File) => {
    const form = new FormData()
    form.append('file', file)
    return api.post<DocumentUploadResponse>('/documents/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data)
  },
  getStatus: (documentId: number) =>
    api.get<DocumentStatusResponse>(`/documents/${documentId}/status`).then(r => r.data),
  getMarkdown: (documentId: number) =>
    api.get<string>(`/documents/${documentId}/markdown`).then(r => r.data),
  generateFlashcards: (documentId: number, data: GenerateFlashcardsRequest) =>
    api.post<AiGenerationJobResponse>(`/documents/${documentId}/generate-flashcards`, data).then(r => r.data),
  getJob: (jobId: number) =>
    api.get<AiGenerationJobResponse>(`/documents/jobs/${jobId}`).then(r => r.data),
  getFlashcards: (documentId: number) =>
    api.get<FlashcardResponse[]>(`/documents/${documentId}/flashcards`).then(r => r.data),
}
