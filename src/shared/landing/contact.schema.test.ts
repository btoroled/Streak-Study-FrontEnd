import { describe, it, expect } from 'vitest'
import { contactSchema } from './contact.schema'

const valid = {
  name: 'Ana García',
  email: 'ana@colegio.edu.pe',
  institution: 'Colegio San Juan',
  message: 'Quisiera información sobre el plan institucional.',
}

describe('contactSchema', () => {
  it('acepta un lead válido', () => {
    expect(contactSchema.safeParse(valid).success).toBe(true)
  })

  it('la institución es opcional', () => {
    const rest = { name: valid.name, email: valid.email, message: valid.message }
    expect(contactSchema.safeParse(rest).success).toBe(true)
  })

  it('rechaza email inválido', () => {
    const r = contactSchema.safeParse({ ...valid, email: 'no-es-mail' })
    expect(r.success).toBe(false)
  })

  it('rechaza mensaje demasiado corto', () => {
    const r = contactSchema.safeParse({ ...valid, message: 'hola' })
    expect(r.success).toBe(false)
  })

  it('rechaza nombre vacío', () => {
    const r = contactSchema.safeParse({ ...valid, name: '' })
    expect(r.success).toBe(false)
  })
})
