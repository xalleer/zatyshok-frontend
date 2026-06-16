export interface Unit {
  id: string
  name: string
  description?: string
  price: number
  capacity: number
  features: string[]
  images: string[]
  propertyId: string
  createdAt: string
  updatedAt: string
}

export interface CreateUnitRequest {
  name: string
  description?: string
  price: number
  capacity: number
  features: string[]
}
