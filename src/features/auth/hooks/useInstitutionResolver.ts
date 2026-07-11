import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { institutionsService } from '@/services/institutions.service'
import { QK } from '@/lib/query-keys'

interface UrlParamResult {
  mode: 'url-param'
  institutionId: number
  institutionName: string | null
  /** Curso de la invitación (`?cid=`), si el link también inscribe a un curso (Issue B.14/W7.1). */
  courseId: number | null
  isLoading: boolean
}

interface ManualResult {
  mode: 'manual'
  courseId: number | null
}

export type InstitutionResolverResult = UrlParamResult | ManualResult

export function useInstitutionResolver(): InstitutionResolverResult {
  const [searchParams] = useSearchParams()
  const iidParam = searchParams.get('iid')
  const iidFromUrl = iidParam !== null ? Number(iidParam) : null
  const isUrlMode = iidFromUrl !== null && !isNaN(iidFromUrl) && iidFromUrl > 0

  const cidParam = searchParams.get('cid')
  const cidFromUrl = cidParam !== null ? Number(cidParam) : null
  const courseId = cidFromUrl !== null && !isNaN(cidFromUrl) && cidFromUrl > 0 ? cidFromUrl : null

  const { data: institution, isLoading } = useQuery({
    queryKey: QK.institution(iidFromUrl ?? 0),
    queryFn: () => institutionsService.get(iidFromUrl!),
    enabled: isUrlMode,
    staleTime: Infinity,
  })

  if (isUrlMode) {
    return {
      mode: 'url-param',
      institutionId: iidFromUrl!,
      institutionName: institution?.name ?? null,
      courseId,
      isLoading,
    }
  }

  // Modo manual: la selección vive en el form (selector de chips), no aquí.
  return { mode: 'manual', courseId }
}
