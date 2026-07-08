import { describe, it, expect } from 'vitest'
import { hasPermission, ASSIGNABLE_ROLES } from './roles'

describe('manage:users', () => {
  it('TEACHER e INSTITUTION_ADMIN tienen el permiso (espejo del @PreAuthorize del backend)', () => {
    expect(hasPermission('TEACHER', 'manage:users')).toBe(true)
    expect(hasPermission('INSTITUTION_ADMIN', 'manage:users')).toBe(true)
  })

  it('STUDENT y SUPER_ADMIN no tienen el permiso', () => {
    expect(hasPermission('STUDENT', 'manage:users')).toBe(false)
    // SUPER_ADMIN queda fuera hasta que backend lo soporte (Issue B.9)
    expect(hasPermission('SUPER_ADMIN', 'manage:users')).toBe(false)
  })
})

describe('ASSIGNABLE_ROLES (espejo del UserManagementService del backend)', () => {
  it('TEACHER solo puede crear STUDENT', () => {
    expect(ASSIGNABLE_ROLES.TEACHER).toEqual(['STUDENT'])
  })

  it('INSTITUTION_ADMIN puede crear STUDENT y TEACHER', () => {
    expect(ASSIGNABLE_ROLES.INSTITUTION_ADMIN).toEqual(['STUDENT', 'TEACHER'])
  })

  it('STUDENT y SUPER_ADMIN no pueden crear a nadie', () => {
    expect(ASSIGNABLE_ROLES.STUDENT).toEqual([])
    expect(ASSIGNABLE_ROLES.SUPER_ADMIN).toEqual([])
  })
})
