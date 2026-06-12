export enum PropertyPolicy {
  FLEXIBLE = 'FLEXIBLE',
  STRICT = 'STRICT'
}

export interface Property {
  id: string
  name: string
  slug: string
  description: string
  coverImage: string | null
  images: string [] | null
  city: string
  address: string
  latitude: number
  longitude: number
  policy: PropertyPolicy
  isActive: boolean
  hostId: string
  createdAt: string
  updatedAt: string
  rating: {
    description: string
  }
  reviewCount: number
}

export interface CreatePropertyRequest {
  name: string
  slug: string
  description?: string
  city?: string
  address?: string
  latitude?: number
  longitude?: number
  policy?: PropertyPolicy
}

export interface CreatePropertyResponse extends Property {}
export interface UpdatePropertyResponse extends Property {}
export interface UpdatePropertyRequest extends Partial<CreatePropertyRequest> {}

