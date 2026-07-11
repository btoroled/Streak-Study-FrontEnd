import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './button'

interface Props {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

/** Controles de paginación (página actual de N, anterior/siguiente). 0-indexado, igual que el backend. */
export default function Pagination({ page, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-3 pt-2">
      <Button
        variant="outline"
        size="sm"
        disabled={page <= 0}
        onClick={() => onPageChange(page - 1)}
        aria-label="Página anterior"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
      <span className="text-xs text-text-secondary">
        Página {page + 1} de {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={page >= totalPages - 1}
        onClick={() => onPageChange(page + 1)}
        aria-label="Página siguiente"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  )
}
