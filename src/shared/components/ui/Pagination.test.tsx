import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import Pagination from './Pagination'

describe('Pagination', () => {
  it('no renderiza nada si solo hay una página', () => {
    const { container } = render(<Pagination page={0} totalPages={1} onPageChange={vi.fn()} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('muestra la página actual y el total', () => {
    render(<Pagination page={1} totalPages={5} onPageChange={vi.fn()} />)
    expect(screen.getByText('Página 2 de 5')).toBeInTheDocument()
  })

  it('deshabilita "anterior" en la primera página y "siguiente" en la última', () => {
    render(<Pagination page={0} totalPages={3} onPageChange={vi.fn()} />)
    expect(screen.getByLabelText('Página anterior')).toBeDisabled()
    expect(screen.getByLabelText('Página siguiente')).not.toBeDisabled()
  })

  it('llama a onPageChange con la página siguiente/anterior', async () => {
    const onPageChange = vi.fn()
    render(<Pagination page={1} totalPages={3} onPageChange={onPageChange} />)

    await userEvent.click(screen.getByLabelText('Página siguiente'))
    expect(onPageChange).toHaveBeenCalledWith(2)

    await userEvent.click(screen.getByLabelText('Página anterior'))
    expect(onPageChange).toHaveBeenCalledWith(0)
  })
})
