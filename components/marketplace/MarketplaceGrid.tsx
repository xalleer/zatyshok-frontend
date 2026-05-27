"use client"

import { useState } from "react"
import { CategoryFilter } from "@/components/marketplace/CategoryFilter"
import { NearbyButton } from "@/components/marketplace/NearbyButton"
import { PropertyCard } from "@/components/marketplace/PropertyCard"
import { PropertyCardSkeleton } from "@/components/marketplace/PropertyCardSkeleton"
import { useProperties, useNearbyProperties } from "@/hooks/useProperties"
import { UnitType } from "@/lib/generated/prisma/enums"
import { SearchX } from "lucide-react"

export function MarketplaceGrid() {
  const [selectedType, setSelectedType] = useState<UnitType | null>(null)
  const [nearbyCoords, setNearbyCoords] = useState<{
    lat: number
    lng: number
  } | null>(null)

  const {
    data: regularData,
    isLoading: regularLoading,
  } = useProperties(
    { unitType: selectedType ?? undefined },
    1
  )

  const {
    data: nearbyItems,
    isLoading: nearbyLoading,
  } = useNearbyProperties(nearbyCoords?.lat ?? null, nearbyCoords?.lng ?? null)

  const isNearbyMode = nearbyCoords !== null
  const isLoading = isNearbyMode ? nearbyLoading : regularLoading
  const items = isNearbyMode ? (nearbyItems ?? []) : (regularData?.items ?? [])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <CategoryFilter
            selected={selectedType}
            onChange={(type) => {
              setSelectedType(type)
              setNearbyCoords(null)
            }}
          />
        </div>

        <NearbyButton
          isActive={isNearbyMode}
          onLocationFound={(lat, lng) => {
            setNearbyCoords({ lat, lng })
            setSelectedType(null)
          }}
          onReset={() => setNearbyCoords(null)}
          className="shrink-0"
        />
      </div>

      {!isLoading && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {isNearbyMode
              ? `${items.length} місць поруч з вами`
              : regularData?.total
                ? `${regularData.total} місць`
                : ""}
          </p>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }, (_, i) => (
            <PropertyCardSkeleton key={i} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState isNearby={isNearbyMode} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  )
}

function EmptyState({ isNearby }: { isNearby: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
      <div className="rounded-full bg-muted p-4">
        <SearchX className="size-6 text-muted-foreground" />
      </div>
      <div>
        <p className="font-medium text-sm">Нічого не знайдено</p>
        <p className="text-sm text-muted-foreground mt-0.5">
          {isNearby
            ? "Поблизу вас поки немає доступних баз"
            : "Спробуйте змінити фільтри або пошукати в іншому регіоні"}
        </p>
      </div>
    </div>
  )
}
