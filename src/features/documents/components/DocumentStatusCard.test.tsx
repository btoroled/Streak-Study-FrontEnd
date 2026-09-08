import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import DocumentStatusCard from './DocumentStatusCard'

describe('DocumentStatusCard', () => {
  it('explica cuando el documento necesita OCR', () => {
    render(
      <DocumentStatusCard
        doc={{
          documentId: 7,
          originalFilename: 'relieve-amazonico.pdf',
          status: 'OCR_REQUIRED',
          markdownAvailable: false,
        }}
      />,
    )

    expect(screen.getByText('relieve-amazonico.pdf')).toBeInTheDocument()
    expect(screen.getByText('Necesita reconocimiento de texto')).toBeInTheDocument()
    expect(screen.queryByText('Markdown ✓')).not.toBeInTheDocument()
  })
})
