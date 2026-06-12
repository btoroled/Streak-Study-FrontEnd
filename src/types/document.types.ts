export type DocumentStatus = 'PENDING' | 'PROCESSING' | 'READY' | 'FAILED'
export type AiJobStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED'

export interface DocumentUploadResponse {
  documentId: number
  originalFilename: string
  status: DocumentStatus
  duplicate: boolean
}

export interface DocumentStatusResponse {
  documentId: number
  originalFilename: string
  status: DocumentStatus
  markdownAvailable: boolean
}

export interface GenerateFlashcardsRequest {
  deckId: number
}

export interface AiGenerationJobResponse {
  jobId: number
  documentId: number
  deckId: number
  status: AiJobStatus
  totalInputTokens: number
  totalOutputTokens: number
  estimatedCostUsd: number
  errorMessage: string | null
}
