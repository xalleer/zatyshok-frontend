// lib/types/property.ts
// Типи для Property та Unit — використовуються по всьому проекту

import type {
  Property,
  Unit,
  UnitImage,
  UnitAmenity,
  PropertyAmenity,
  UnitType,
  CancellationPolicy,
  BookingMode,
} from "@/lib/generated/prisma"

// ─── Property Types ───────────────────────────────────────────────────────────

/**
 * Мінімальна картка для маркетплейсу (list view)
 * Не включає всі поля — лише те, що потрібно для карточки
 */
export type PropertyCard = Pick<
  Property,
  | "id"
  | "slug"
  | "name"
  | "city"
  | "region"
  | "coverImage"
  | "ratingAvg"
  | "ratingCount"
  | "latitude"
  | "longitude"
> & {
  /** Мінімальна ціна серед усіх Unit цієї бази */
  minPrice: number
  /** Перші 4 фото з усіх Unit для свайпу в картці */
  previewImages: string[]
  /** Кілька бейджів для картки */
  amenities: Pick<PropertyAmenity, "icon" | "label">[]
}

/**
 * Повна сторінка об'єкта /p/[slug]
 */
export type PropertyDetail = Property & {
  amenities: PropertyAmenity[]
  units: UnitDetail[]
}

// ─── Unit Types ───────────────────────────────────────────────────────────────

/**
 * Unit з фото та послугами — для сторінки об'єкта
 */
export type UnitDetail = Unit & {
  images: UnitImage[]
  amenities: UnitAmenity[]
  /** Ціна як число (Decimal з Prisma → number для клієнта) */
  pricePerNight: number
}

/**
 * Доступність Unit на місяць
 */
export type UnitAvailability = {
  unitId: string
  /** Дати які заблоковані (ISO рядки "YYYY-MM-DD") */
  unavailableDates: string[]
}

// ─── Filters & Search ─────────────────────────────────────────────────────────

export type PropertyFilters = {
  city?: string
  region?: string
  unitType?: UnitType
  priceMin?: number
  priceMax?: number
  /** Для "Недалеко від мене" */
  lat?: number
  lng?: number
  radiusKm?: number
}

// ─── Re-exports зручних enum значень ─────────────────────────────────────────

export { UnitType, CancellationPolicy, BookingMode }
