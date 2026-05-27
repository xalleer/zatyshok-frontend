
"use client"

import { useQuery } from "@tanstack/react-query"
import type { UnitAvailability } from "@/lib/types/property"
import type { ApiResponse } from "@/lib/types/api"

async function fetchAvailability(unitId: string): Promise<UnitAvailability> {
  const res = await fetch(`/api/units/${unitId}/availability`)
  const json: ApiResponse<UnitAvailability> = await res.json()

  if (!json.ok) throw new Error(json.error)
  return json.data
}

/**
 * Хук для календаря — які дати заблоковані для конкретного Unit
 *
 * Використання:
 * const { data } = useAvailability(unit.id)
 * const disabled = data?.unavailableDates.map(d => new Date(d)) ?? []
 */
export function useAvailability(unitId: string | null) {
  return useQuery({
    queryKey: ["availability", unitId],
    queryFn: () => fetchAvailability(unitId!),
    enabled: unitId !== null,
    staleTime: 30 * 1000,
  })
}
