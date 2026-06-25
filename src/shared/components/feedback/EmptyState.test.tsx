import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Search } from 'lucide-react'
import EmptyState from './EmptyState'

describe('EmptyState', () => {
  it('muestra título y descripción', () => {
    render(<EmptyState icon={Search} title="Sin resultados" description="No encontramos nada" />)

    expect(screen.getByText('Sin resultados')).toBeInTheDocument()
    expect(screen.getByText('No encontramos nada')).toBeInTheDocument()
  })

  it('no renderiza el botón de acción si no se provee', () => {
    render(<EmptyState title="Sin mazos" />)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('ejecuta el callback al hacer click en la acción', async () => {
    const onClick = vi.fn()
    render(<EmptyState title="Sin mazos" action={{ label: 'Crear mazo', onClick }} />)

    await userEvent.click(screen.getByRole('button', { name: 'Crear mazo' }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
