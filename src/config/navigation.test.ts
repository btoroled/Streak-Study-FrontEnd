import { describe, it, expect } from 'vitest'
import { filterNavItems } from './navigation'

const allFlagsOn = () => true
const allFlagsOff = () => false

const pathsFor = (role: Parameters<typeof filterNavItems>[0], flags = allFlagsOn) =>
  filterNavItems(role, flags).map((i) => i.to)

describe('filterNavItems', () => {
  it('STUDENT ve la tienda pero no el panel de plataforma', () => {
    const paths = pathsFor('STUDENT')
    expect(paths).toContain('/store')
    expect(paths).not.toContain('/admin')
  })

  it('TEACHER no ve la tienda (gamificación de compra es de alumnos)', () => {
    const paths = pathsFor('TEACHER')
    expect(paths).not.toContain('/store')
    expect(paths).not.toContain('/admin')
  })

  it('SUPER_ADMIN ve el panel de plataforma', () => {
    expect(pathsFor('SUPER_ADMIN')).toContain('/admin')
  })

  it('el ranking respeta el feature flag aunque el rol tenga permiso', () => {
    expect(pathsFor('STUDENT', allFlagsOn)).toContain('/leaderboard')
    expect(pathsFor('STUDENT', allFlagsOff)).not.toContain('/leaderboard')
  })

  it('sin rol (sesión no hidratada) no hay ítems', () => {
    expect(filterNavItems(null, allFlagsOn)).toEqual([])
  })

  it('todos los roles ven los ítems base en el mismo orden relativo', () => {
    for (const role of ['STUDENT', 'TEACHER', 'INSTITUTION_ADMIN', 'SUPER_ADMIN'] as const) {
      const paths = pathsFor(role)
      expect(paths.indexOf('/dashboard')).toBeLessThan(paths.indexOf('/study'))
      expect(paths.at(-1)).toBe('/profile')
    }
  })
})
