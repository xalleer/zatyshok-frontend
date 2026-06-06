export enum PropertyPolicy {
  FLEXIBLE = 'FLEXIBLE',
  STRICT = 'STRICT'
}

export interface Property {
  id: string
  name: string
  slug: string
  description: string
  coverImage: string
  images: string []
  city: string
  address: string
  latitude: string
  longitude: string
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
  latitude?: string
  longitude?: string
  policy?: PropertyPolicy
}

export interface CreatePropertyResponse extends Property {}
