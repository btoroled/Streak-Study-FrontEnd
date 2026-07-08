export interface InstitutionSummary {
  id: number
  name: string
}

export interface InstitutionRequest {
  name: string
  code: string
}

export interface InstitutionResponse {
  id: number
  name: string
  code: string
  active: boolean
  createdAt: string
}
