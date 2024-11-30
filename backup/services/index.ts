import ApiClient from '@/lib/api'
import type { ServiceArea, EmergencyContact, ServiceType, ApiResponse } from '@/types/api'

export const AreaService = {
  async getServiceAreas(): Promise<ApiResponse<ServiceArea[]>> {
    return ApiClient.get<ServiceArea[]>('/areas')
  },

  async getServiceArea(id: string): Promise<ApiResponse<ServiceArea>> {
    return ApiClient.get<ServiceArea>(`/areas/${id}`)
  },

  async isServiceAvailable(postcode: string): Promise<ApiResponse<boolean>> {
    return ApiClient.get<boolean>(`/areas/check/${postcode}`)
  }
}

export const EmergencyService = {
  async getEmergencyContact(): Promise<ApiResponse<EmergencyContact>> {
    return ApiClient.get<EmergencyContact>('/emergency/contact')
  },

  async requestCallback(
    phone: string,
    name: string,
    issue: string
  ): Promise<ApiResponse<{ requestId: string }>> {
    return ApiClient.post<{ requestId: string }>('/emergency/callback', {
      phone,
      name,
      issue,
    })
  }
}

export const ServiceTypeService = {
  async getServices(): Promise<ApiResponse<ServiceType[]>> {
    return ApiClient.get<ServiceType[]>('/services')
  },

  async getService(slug: string): Promise<ApiResponse<ServiceType>> {
    return ApiClient.get<ServiceType>(`/services/${slug}`)
  }
}

export { ApiClient }
