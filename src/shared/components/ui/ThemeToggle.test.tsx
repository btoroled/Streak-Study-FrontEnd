import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from 'next-themes'
import { ThemeToggle } from './ThemeToggle'

// next-themes persiste en localStorage (key "theme"): sin limpiar entre tests,
// un test que cambia el tema deja el siguiente arrancando en el valor viejo.
beforeEach(() => localStorage.clear())

function renderToggle() {
  return render(
    <ThemeProvider attribute="class" defaultTheme="dark" themes={['dark', 'light']} enableSystem={false}>
      <ThemeToggle />
    </ThemeProvider>,
  )
}

describe('ThemeToggle', () => {
  it('arranca en oscuro y ofrece cambiar a claro', () => {
    renderToggle()
    expect(screen.getByRole('button', { name: /cambiar a tema claro/i })).toBeInTheDocument()
    expect(screen.getByText('Claro')).toBeInTheDocument()
  })

  it('click alterna el tema y el label/aria-label se actualizan', async () => {
    renderToggle()
    const button = screen.getByRole('button', { name: /cambiar a tema claro/i })

    await userEvent.click(button)

    expect(await screen.findByRole('button', { name: /cambiar a tema oscuro/i })).toBeInTheDocument()
    expect(screen.getByText('Oscuro')).toBeInTheDocument()
    expect(document.documentElement.classList.contains('light')).toBe(true)
  })

  it('compact oculta el label pero conserva el ícono y el aria-label', () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="dark" themes={['dark', 'light']} enableSystem={false}>
        <ThemeToggle compact />
      </ThemeProvider>,
    )
    expect(screen.getByRole('button', { name: /cambiar a tema claro/i })).toBeInTheDocument()
    expect(screen.queryByText('Claro')).not.toBeInTheDocument()
  })
})
