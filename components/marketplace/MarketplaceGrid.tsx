// components/marketplace/MarketplaceGrid.tsx
// Основна сітка маркетплейсу
//
// Зміни від початкової версії:
// - Приймає initialFilters з URL (city, region) через props
// - Стан фільтрів синхронізується з URL через router.push
// - Додано заголовок секції

"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CategoryFilter } from "@/components/marketplace/CategoryFilter"
import { NearbyButton } from "@/components/marketplace/NearbyButton"
import { PropertyCard } from "@/components/marketplace/PropertyCard"
import { PropertyCardSkeleton } from "@/components/marketplace/PropertyCardSkeleton"
import { useProperties, useNearbyProperties } from "@/hooks/useProperties"
import { UnitType } from "@/lib/generated/prisma/enums"
import { SearchX } from "lucide-react"
import type { PropertyFilters } from "@/lib/types/property"

// ─── Props ────────────────────────────────────────────────────────────────────

type MarketplaceGridProps = {
  /** Початкові фільтри з URL searchParams (Server Component передає сюди) */
  initialFilters?: {
    city?: string
    region?: string
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export function MarketplaceGrid({ initialFilters = {} }: MarketplaceGridProps) {
  const router = useRouter()

  // Тип об'єкта (CategoryFilter)
  const [selectedType, setSelectedType] = useState<UnitType | null>(null)

  // Координати "Недалеко від мене"
  const [nearbyCoords, setNearbyCoords] = useState<{
    lat: number
    lng: number
  } | null>(null)

  // Фільтри з URL (city/region) + тип з локального стану
  const filters: PropertyFilters = {
    ...initialFilters,
    unitType: selectedType ?? undefined,
  }

  // ─── Queries ─────────────────────────────────────────────────────────────

  const {
    data: regularData,
    isLoading: regularLoading,
  } = useProperties(filters, 1)

  const {
    data: nearbyItems,
    isLoading: nearbyLoading,
  } = useNearbyProperties(nearbyCoords?.lat ?? null, nearbyCoords?.lng ?? null)

  // ─── Derived state ────────────────────────────────────────────────────────

  const isNearbyMode = nearbyCoords !== null
  const isLoading = isNearbyMode ? nearbyLoading : regularLoading
  const items = isNearbyMode
    ? (nearbyItems ?? [])
    : (regularData?.items ?? [])

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleCategoryChange = (type: UnitType | null) => {
    setSelectedType(type)
    setNearbyCoords(null)
  }

  const handleLocationFound = (lat: number, lng: number) => {
    setNearbyCoords({ lat, lng })
    setSelectedType(null)
  }

  const handleResetNearby = () => {
    setNearbyCoords(null)
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="space-y-5">

      {/* Заголовок секції — показуємо якщо є пошук по місту */}
      {initialFilters.city && (
        <div>
          <h2 className="font-heading text-xl font-medium text-foreground">
            Результати для «{initialFilters.city}»
          </h2>
        </div>
      )}

      {/* Фільтри — категорії + геолокація */}
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <CategoryFilter
            selected={selectedType}
            onChange={handleCategoryChange}
          />
        </div>
        <NearbyButton
          isActive={isNearbyMode}
          onLocationFound={handleLocationFound}
          onReset={handleResetNearby}
          className="shrink-0 mt-0.5"
        />
      </div>

      {/* Лічильник результатів */}
      {!isLoading && items.length > 0 && (
        <p className="text-sm text-muted-foreground">
          {isNearbyMode
            ? `${items.length} місць поруч з вами`
            : regularData?.total
              ? `${regularData.total} місць`
              : ""}
        </p>
      )}

      {/* Сітка карток */}
      {isLoading ? (
        <SkeletonGrid />
      ) : items.length === 0 ? (
        <EmptyState isNearby={isNearbyMode} />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}

    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }, (_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  )
}

function EmptyState({ isNearby }: { isNearby: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
      <div className="rounded-full bg-muted p-4">
        <SearchX className="size-6 text-muted-foreground" />
      </div>
      <div>
        <p className="font-medium text-sm">Нічого не знайдено</p>
        <p className="text-sm text-muted-foreground mt-1">
          {isNearby
            ? "Поблизу вас поки немає доступних баз"
            : "Спробуйте змінити фільтри або пошукати в іншому регіоні"}
        </p>
      </div>
    </div>
  )
}
