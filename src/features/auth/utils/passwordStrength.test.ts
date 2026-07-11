import { describe, it, expect } from 'vitest'
import { calculatePasswordStrength } from './passwordStrength'

describe('calculatePasswordStrength', () => {
  it('vacía o muy corta y simple es débil', () => {
    expect(calculatePasswordStrength('')).toBe('weak')
    expect(calculatePasswordStrength('abc')).toBe('weak')
    expect(calculatePasswordStrength('abcdefgh')).toBe('weak') // solo len>=8
  })

  it('mezcla mayúscula + número (3 criterios) es media', () => {
    expect(calculatePasswordStrength('Abcdefg1')).toBe('medium')
  })

  it('larga con mayúscula, número y símbolo es fuerte', () => {
    expect(calculatePasswordStrength('Abcdefgh123!')).toBe('strong')
  })
})
