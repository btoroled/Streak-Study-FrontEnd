import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import RoleGuard from './RoleGuard'
import { useAuthStore } from '@/store/auth.store'
import type { UserRole } from '@/config/roles'

function renderWithRole(role: UserRole | null, ui: React.ReactElement) {
  // Reset y set role del store antes de renderizar
  useAuthStore.getState().logout()
  if (role) {
    useAuthStore.getState().setAuth({
      accessToken: 't',
      refreshToken: 'r',
      userId: 1,
      institutionId: 1,
      email: 'x@y.com',
      role,
      xp: 0,
    })
  }
  return render(
    <MemoryRouter initialEntries={['/x']}>
      <Routes>
        <Route path="/x" element={ui} />
        <Route path="/403" element={<div>FORBIDDEN</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('RoleGuard', () => {
  beforeEach(() => {
    useAuthStore.getState().logout()
  })

  it('renderiza children cuando el usuario tiene el permiso', () => {
    renderWithRole(
      'STUDENT',
      <RoleGuard permission="view:store">
        <div>tienda</div>
      </RoleGuard>,
    )
    expect(screen.getByText('tienda')).toBeInTheDocument()
  })

  it('redirige a /403 cuando el rol no tiene el permiso', () => {
    renderWithRole(
      'TEACHER',
      <RoleGuard permission="view:store">
        <div>tienda</div>
      </RoleGuard>,
    )
    expect(screen.queryByText('tienda')).not.toBeInTheDocument()
    expect(screen.getByText('FORBIDDEN')).toBeInTheDocument()
  })

  it('renderiza fallback={null} en lugar de redirigir', () => {
    renderWithRole(
      'TEACHER',
      <RoleGuard permission="view:store" fallback={null}>
        <div>tienda</div>
      </RoleGuard>,
    )
    expect(screen.queryByText('tienda')).not.toBeInTheDocument()
    expect(screen.queryByText('FORBIDDEN')).not.toBeInTheDocument()
  })

  it('renderiza un fallback personalizado en lugar de redirigir', () => {
    renderWithRole(
      'TEACHER',
      <RoleGuard permission="view:store" fallback={<div>acceso denegado</div>}>
        <div>tienda</div>
      </RoleGuard>,
    )
    expect(screen.queryByText('tienda')).not.toBeInTheDocument()
    expect(screen.queryByText('FORBIDDEN')).not.toBeInTheDocument()
    expect(screen.getByText('acceso denegado')).toBeInTheDocument()
  })

  it('respeta minRole por jerarquía', () => {
    renderWithRole(
      'INSTITUTION_ADMIN',
      <RoleGuard minRole="TEACHER">
        <div>admin-only</div>
      </RoleGuard>,
    )
    expect(screen.getByText('admin-only')).toBeInTheDocument()
  })

  it('niega cuando el rol está por debajo del minRole', () => {
    renderWithRole(
      'STUDENT',
      <RoleGuard minRole="TEACHER">
        <div>admin-only</div>
      </RoleGuard>,
    )
    expect(screen.getByText('FORBIDDEN')).toBeInTheDocument()
  })

  it('respeta rol exacto', () => {
    renderWithRole(
      'STUDENT',
      <RoleGuard role="STUDENT">
        <div>student-only</div>
      </RoleGuard>,
    )
    expect(screen.getByText('student-only')).toBeInTheDocument()
  })

  it('niega cuando el rol no coincide exactamente', () => {
    renderWithRole(
      'STUDENT',
      <RoleGuard role="TEACHER">
        <div>teacher-only</div>
      </RoleGuard>,
    )
    expect(screen.queryByText('teacher-only')).not.toBeInTheDocument()
    expect(screen.getByText('FORBIDDEN')).toBeInTheDocument()
  })

  it('sin rol en el store → niega', () => {
    renderWithRole(
      null,
      <RoleGuard permission="view:store">
        <div>tienda</div>
      </RoleGuard>,
    )
    expect(screen.getByText('FORBIDDEN')).toBeInTheDocument()
  })

  it('permite el acceso sin restricciones cuando no se especifica ningún check', () => {
    renderWithRole(
      'STUDENT',
      <RoleGuard>
        <div>siempre visible</div>
      </RoleGuard>,
    )
    expect(screen.getByText('siempre visible')).toBeInTheDocument()
  })
})
