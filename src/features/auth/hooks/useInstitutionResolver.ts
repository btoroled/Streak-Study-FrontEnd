import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { institutionsService } from '@/services/institutions.service'
import { QK } from '@/lib/query-keys'

type ResolverMode = 'url-param' | 'manual'

interface UrlParamResult {
  mode: 'url-param'
  institutionId: number
  institutionName: string | null
  isLoading: boolean
}

interface ManualResult {
  mode: 'manual'
  institutionId: number
  institutionName: null
  isLoading: false
  setInstitutionId: (id: number) => void
}

export type InstitutionResolverResult = UrlParamResult | ManualResult

export function useInstitutionResolver(): InstitutionResolverResult {
  const [searchParams] = useSearchParams()
  const iidParam = searchParams.get('iid')
  const iidFromUrl = iidParam !== null ? Number(iidParam) : null
  const isUrlMode = iidFromUrl !== null && !isNaN(iidFromUrl) && iidFromUrl > 0

  const defaultId = Number(import.meta.env.VITE_DEFAULT_INSTITUTION_ID ?? 1)
  const [manualId, setManualId] = useState(defaultId)

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
      isLoading,
    }
  }

  return {
    mode: 'manual',
    institutionId: manualId,
    institutionName: null,
    isLoading: false,
    setInstitutionId: setManualId,
  }
}
