export interface ApiResponse<T> {
  data: T
  status: number
  ok: boolean
}

export interface ServiceArea {
  id: string
  name: string
  postcode: string
  active: boolean
}

export interface EmergencyContact {
  phone: string
  available24x7: boolean
  responseTime: string
}

export interface ServiceType {
  id: string
  name: string
  description: string
  icon: string
  slug: string
}

export interface ApiError {
  message: string
  code: string
  status: number
}
