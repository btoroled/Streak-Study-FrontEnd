import { describe, it, expect } from 'vitest'
import { deriveWizardStep } from './wizard.utils'

const base = {
  uploadPhase: 'done' as const,
  isDuplicatePending: false,
  markdownConfirmed: false,
  jobStatus: null,
}

describe('deriveWizardStep', () => {
  it('paso 1 mientras no hay upload completado (idle/uploading/error)', () => {
    expect(deriveWizardStep({ ...base, uploadPhase: 'idle' })).toBe(1)
    expect(deriveWizardStep({ ...base, uploadPhase: 'uploading' })).toBe(1)
    expect(deriveWizardStep({ ...base, uploadPhase: 'error' })).toBe(1)
  })

  it('paso 1 si hay un duplicado pendiente de decisión', () => {
    expect(deriveWizardStep({ ...base, isDuplicatePending: true })).toBe(1)
  })

  it('paso 2 (revisar markdown) tras subir, hasta confirmar', () => {
    expect(deriveWizardStep(base)).toBe(2)
  })

  it('paso 3 (generar) tras confirmar el markdown, incluso con job en curso o fallido', () => {
    expect(deriveWizardStep({ ...base, markdownConfirmed: true })).toBe(3)
    expect(deriveWizardStep({ ...base, markdownConfirmed: true, jobStatus: 'PENDING' })).toBe(3)
    expect(deriveWizardStep({ ...base, markdownConfirmed: true, jobStatus: 'RUNNING' })).toBe(3)
    expect(deriveWizardStep({ ...base, markdownConfirmed: true, jobStatus: 'FAILED' })).toBe(3)
  })

  it('paso 4 (ver mazo) cuando el job completó', () => {
    expect(deriveWizardStep({ ...base, markdownConfirmed: true, jobStatus: 'COMPLETED' })).toBe(4)
  })
})
