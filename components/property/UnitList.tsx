// components/property/UnitList.tsx
// Список юнітів з фільтрами по типу
// Включає Floating Bottom Bar (мобільний) та Sticky Card (десктоп)

"use client"

import { useState } from "react"
import Image from "next/image"
import { Users, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AmenityBadge } from "@/components/property/AmenityBadge"
import { PriceDisplay } from "@/components/shared/PriceDisplay"
import { BookingSheet } from "@/components/property/BookingSheet"
import { cn } from "@/lib/utils"
import type { PropertyDetail, UnitDetail } from "@/lib/types/property"
import { UnitType } from "@/lib/generated/prisma/enums"

const UNIT_TYPE_LABELS: Record<UnitType, string> = {
  [UnitType.HOUSE]: "Будиночки",
  [UnitType.GLAMPING]: "Глемпінги",
  [UnitType.GAZEBO]: "Альтанки",
  [UnitType.AFRAME]: "A-Frame",
  [UnitType.TENT]: "Намети",
  [UnitType.OTHER]: "Інше",
}

type UnitListProps = {
  property: PropertyDetail
}

export function UnitList({ property }: UnitListProps) {
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null)
  const [bookingOpen, setBookingOpen] = useState(false)

  // Унікальні типи юнітів для фільтра
  const unitTypes = [...new Set(property.units.map((u) => u.type))]
  const [activeType, setActiveType] = useState<UnitType | null>(
    unitTypes.length > 1 ? null : null
  )

  const filteredUnits = activeType
    ? property.units.filter((u) => u.type === activeType)
    : property.units

  const minPrice = property.units.length > 0
    ? Math.min(...property.units.map((u) => u.pricePerNight))
    : 0

  const selectedUnit = property.units.find((u) => u.id === selectedUnitId)
    ?? (property.units.length === 1 ? property.units[0] : null)

  const handleBook = (unitId: string) => {
    setSelectedUnitId(unitId)
    setBookingOpen(true)
  }

  const handleFloatingBook = () => {
    if (property.units.length === 1) {
      setSelectedUnitId(property.units[0].id)
    }
    setBookingOpen(true)
  }

  return (
    <>
      {/* Заголовок секції */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-medium text-foreground">
            {property.units.length === 1
              ? "Доступний варіант"
              : `Доступні варіанти (${property.units.length})`}
          </h2>
        </div>

        {/* Фільтр по типу (якщо більше 1 типу) */}
        {unitTypes.length > 1 && (
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
            <FilterChip
              label="Всі"
              active={activeType === null}
              onClick={() => setActiveType(null)}
            />
            {unitTypes.map((type) => (
              <FilterChip
                key={type}
                label={UNIT_TYPE_LABELS[type]}
                active={activeType === type}
                onClick={() => setActiveType(type)}
              />
            ))}
          </div>
        )}

        {/* Список юнітів */}
        <div className="space-y-4">
          {filteredUnits.map((unit) => (
            <UnitCard
              key={unit.id}
              unit={unit}
              onBook={() => handleBook(unit.id)}
            />
          ))}
        </div>
      </div>

      {/* ── Floating Bottom Bar (мобільний) ── */}
      <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden">
        <div className="border-t border-border bg-background/95 backdrop-blur-md px-4 py-3 pb-safe flex items-center justify-between gap-3">
          <div>
            {minPrice > 0 && (
              <PriceDisplay
                amount={minPrice}
                period="night"
                prefix="від"
                size="md"
              />
            )}
            <p className="text-xs text-muted-foreground mt-0.5">
              {property.units.length > 1
                ? `${property.units.length} варіанти`
                : "Вільно для бронювання"}
            </p>
          </div>
          <Button
            onClick={handleFloatingBook}
            className="h-11 px-6 bg-[var(--forest)] hover:bg-[var(--forest)]/90 font-medium rounded-xl"
          >
            Забронювати
            <ChevronRight className="size-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* ── Booking Sheet ── */}
      {(selectedUnit || property.units.length > 0) && (
        <BookingSheet
          open={bookingOpen}
          onOpenChange={setBookingOpen}
          unit={selectedUnit ?? null}
          units={property.units}
          property={property}
          onSelectUnit={setSelectedUnitId}
        />
      )}
    </>
  )
}

// ─── UnitCard ─────────────────────────────────────────────────────────────────

function UnitCard({ unit, onBook }: { unit: UnitDetail; onBook: () => void }) {
  const [photoIdx, setPhotoIdx] = useState(0)
  const photos = unit.images.map((i) => i.url)

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden transition-shadow hover:shadow-md">
      {/* Фото */}
      {photos.length > 0 && (
        <div className="relative aspect-[16/9] overflow-hidden bg-muted">
          <Image
            src={photos[photoIdx]}
            alt={unit.name}
            fill
            sizes="(max-width: 640px) 100vw, 600px"
            className="object-cover"
          />
          {/* Dot-навігація */}
          {photos.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {photos.slice(0, 5).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPhotoIdx(i)}
                  className={cn(
                    "rounded-full transition-all",
                    i === photoIdx ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/60"
                  )}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Інформація */}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-heading font-medium text-base text-foreground">
              {unit.name}
            </h3>
            {unit.maxGuests > 0 && (
              <div className="flex items-center gap-1 text-muted-foreground mt-0.5">
                <Users className="size-3.5" />
                <span className="text-xs">до {unit.maxGuests} гостей</span>
              </div>
            )}
          </div>
          <PriceDisplay
            amount={unit.pricePerNight}
            period="night"
            size="md"
            className="shrink-0"
          />
        </div>

        {unit.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {unit.description}
          </p>
        )}

        {unit.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {unit.amenities.map((a) => (
              <AmenityBadge key={a.id} icon={a.icon} label={a.label} size="sm" />
            ))}
          </div>
        )}

        <Button
          onClick={onBook}
          className="w-full h-10 bg-[var(--forest)] hover:bg-[var(--forest)]/90 font-medium"
        >
          Обрати та забронювати
        </Button>
      </div>
    </div>
  )
}

// ─── FilterChip ───────────────────────────────────────────────────────────────

function FilterChip({
                      label,
                      active,
                      onClick,
                    }: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-all",
        active
          ? "bg-[var(--forest)] text-white border-[var(--forest)]"
          : "bg-white text-foreground border-border hover:border-[var(--forest)]/40"
      )}
    >
      {label}
    </button>
  )
}
