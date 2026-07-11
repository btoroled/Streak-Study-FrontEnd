export type PasswordStrength = 'weak' | 'medium' | 'strong'

/**
 * Solo informativo — el backend únicamente exige mínimo 8 caracteres (sin
 * mayúscula/número obligatorios), así que este cálculo no debe usarse para
 * bloquear el submit (Issue W2.4): bloquear más que el backend generaría
 * un registro rechazado en el front que la API igual aceptaría.
 */
export function calculatePasswordStrength(password: string): PasswordStrength {
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 2) return 'weak'
  if (score === 3) return 'medium'
  return 'strong'
}
