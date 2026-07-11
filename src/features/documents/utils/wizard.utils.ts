import type { AiJobStatus } from '@/types/document.types'

export type WizardStep = 1 | 2 | 3 | 4

export interface WizardState {
  uploadPhase: 'idle' | 'uploading' | 'error' | 'done'
  /** duplicate detectado y el usuario aún no decide continuar/cancelar */
  isDuplicatePending: boolean
  markdownConfirmed: boolean
  jobStatus: AiJobStatus | null
}

/**
 * El paso del wizard se deriva del estado real (upload, doc, job) en vez de
 * llevar un índice manual: así no puede desincronizarse del backend.
 */
export function deriveWizardStep(s: WizardState): WizardStep {
  if (s.uploadPhase !== 'done' || s.isDuplicatePending) return 1
  if (!s.markdownConfirmed) return 2
  if (s.jobStatus === 'COMPLETED') return 4
  return 3
}
