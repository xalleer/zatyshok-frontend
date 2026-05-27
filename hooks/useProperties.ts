
"use client"

import { useQuery } from "@tanstack/react-query"
import type { PropertyCard, PropertyFilters } from "@/lib/types/property"
import type { ApiResponse } from "@/lib/types/api"

type PropertiesResponse = {
  items: PropertyCard[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}


async function fetchProperties(
  filters: PropertyFilters,
  page: number
): Promise<PropertiesResponse> {
  const params = new URLSearchParams()

  if (filters.city) params.set("city", filters.city)
  if (filters.region) params.set("region", filters.region)
  if (filters.unitType) params.set("unitType", filters.unitType)
  if (filters.priceMin) params.set("priceMin", String(filters.priceMin))
  if (filters.priceMax) params.set("priceMax", String(filters.priceMax))
  if (filters.lat) params.set("lat", String(filters.lat))
  if (filters.lng) params.set("lng", String(filters.lng))
  if (filters.radiusKm) params.set("radiusKm", String(filters.radiusKm))
  params.set("page", String(page))

  const res = await fetch(`/api/properties?${params.toString()}`)
  const json: ApiResponse<PropertiesResponse> = await res.json()

  if (!json.ok) throw new Error(json.error)
  return json.data
}

async function fetchNearbyProperties(
  lat: number,
  lng: number,
  radiusKm = 20
): Promise<PropertyCard[]> {
  const params = new URLSearchParams({
    lat: String(lat),
    lng: String(lng),
    radiusKm: String(radiusKm),
  })

  const res = await fetch(`/api/properties?${params.toString()}`)
  const json: ApiResponse<PropertiesResponse> = await res.json()

  if (!json.ok) throw new Error(json.error)
  return json.data.items
}

export function useProperties(filters: PropertyFilters = {}, page = 1) {
  return useQuery({
    queryKey: ["properties", filters, page],
    queryFn: () => fetchProperties(filters, page),
    staleTime: 2 * 60 * 1000,
  })
}

export function useNearbyProperties(
  lat: number | null,
  lng: number | null,
  radiusKm = 20
) {
  return useQuery({
    queryKey: ["properties", "nearby", lat, lng, radiusKm],
    queryFn: () => fetchNearbyProperties(lat!, lng!, radiusKm),
    enabled: lat !== null && lng !== null,
    staleTime: 5 * 60 * 1000,
  })
}
