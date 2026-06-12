export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('es', { dateStyle: 'medium' }).format(new Date(iso))
}

export function isToday(iso: string): boolean {
  const d = new Date(iso)
  const now = new Date()
  return d.toDateString() === now.toDateString()
}

export function daysAgo(iso: string): number {
  const ms = Date.now() - new Date(iso).getTime()
  return Math.floor(ms / (1000 * 60 * 60 * 24))
}
