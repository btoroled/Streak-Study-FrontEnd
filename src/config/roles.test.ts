import { describe, it, expect } from 'vitest'
import { hasPermission, ASSIGNABLE_ROLES } from './roles'

describe('manage:users', () => {
  it('TEACHER, INSTITUTION_ADMIN y SUPER_ADMIN tienen el permiso (espejo del @PreAuthorize del backend)', () => {
    expect(hasPermission('TEACHER', 'manage:users')).toBe(true)
    expect(hasPermission('INSTITUTION_ADMIN', 'manage:users')).toBe(true)
    expect(hasPermission('SUPER_ADMIN', 'manage:users')).toBe(true)
  })

  it('STUDENT no tiene el permiso', () => {
    expect(hasPermission('STUDENT', 'manage:users')).toBe(false)
  })
})

describe('view:admin', () => {
  it('solo SUPER_ADMIN puede ver el panel de administración', () => {
    expect(hasPermission('SUPER_ADMIN', 'view:admin')).toBe(true)
    expect(hasPermission('STUDENT', 'view:admin')).toBe(false)
    expect(hasPermission('TEACHER', 'view:admin')).toBe(false)
    expect(hasPermission('INSTITUTION_ADMIN', 'view:admin')).toBe(false)
  })
})

describe('view:teacher-dashboard', () => {
  it('TEACHER, INSTITUTION_ADMIN y SUPER_ADMIN pueden ver el dashboard de profesor', () => {
    expect(hasPermission('TEACHER', 'view:teacher-dashboard')).toBe(true)
    expect(hasPermission('INSTITUTION_ADMIN', 'view:teacher-dashboard')).toBe(true)
    expect(hasPermission('SUPER_ADMIN', 'view:teacher-dashboard')).toBe(true)
  })

  it('STUDENT no tiene el permiso', () => {
    expect(hasPermission('STUDENT', 'view:teacher-dashboard')).toBe(false)
  })
})

describe('ASSIGNABLE_ROLES (espejo del UserManagementService del backend)', () => {
  it('TEACHER solo puede crear STUDENT', () => {
    expect(ASSIGNABLE_ROLES.TEACHER).toEqual(['STUDENT'])
  })

  it('INSTITUTION_ADMIN puede crear STUDENT y TEACHER', () => {
    expect(ASSIGNABLE_ROLES.INSTITUTION_ADMIN).toEqual(['STUDENT', 'TEACHER'])
  })

  it('SUPER_ADMIN puede crear STUDENT, TEACHER e INSTITUTION_ADMIN (Issue B.9), nunca SUPER_ADMIN', () => {
    expect(ASSIGNABLE_ROLES.SUPER_ADMIN).toEqual(['STUDENT', 'TEACHER', 'INSTITUTION_ADMIN'])
  })

  it('STUDENT no puede crear a nadie', () => {
    expect(ASSIGNABLE_ROLES.STUDENT).toEqual([])
  })
})
