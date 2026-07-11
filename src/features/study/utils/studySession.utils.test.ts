import { describe, it, expect } from 'vitest'
import { normalizeText, isAnswerMatch } from './studySession.utils'

describe('normalizeText', () => {
  it('convierte a minúsculas, quita tildes y recorta espacios', () => {
    expect(normalizeText('  Córdoba  ')).toBe('cordoba')
    expect(normalizeText('Fotosíntesis')).toBe('fotosintesis')
  })
})

describe('isAnswerMatch', () => {
  it('coincide con mismo texto exacto', () => {
    expect(isAnswerMatch('Mitocondria', 'Mitocondria')).toBe(true)
  })

  it('coincide ignorando mayúsculas, tildes y espacios extra', () => {
    expect(isAnswerMatch('  mitocóndria  ', 'Mitocóndria')).toBe(true)
  })

  it('no coincide si el texto es distinto', () => {
    expect(isAnswerMatch('Núcleo', 'Mitocondria')).toBe(false)
  })

  it('no coincide con respuesta vacía', () => {
    expect(isAnswerMatch('   ', 'Mitocondria')).toBe(false)
  })
})
