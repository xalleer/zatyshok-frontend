// lib/api/properties.ts
// Server-side функції для роботи з Property
// Викликаються з Route Handlers або Server Components

import { prisma } from "@/lib/prisma"
import type { PropertyCard, PropertyDetail, PropertyFilters } from "@/lib/types/property"

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Конвертуємо Prisma Decimal → number для передачі на клієнт
 */
function toNumber(decimal: unknown): number {
  return parseFloat(String(decimal))
}

// ─── Queries ─────────────────────────────────────────────────────────────────

/**
 * Список об'єктів для маркетплейсу з фільтрами
 */
export async function getProperties(
  filters: PropertyFilters = {},
  page = 1,
  pageSize = 20
): Promise<{ items: PropertyCard[]; total: number }> {
  const where = {
    isActive: true,
    isHidden: false,
    ...(filters.city && { city: { contains: filters.city, mode: "insensitive" as const } }),
    ...(filters.region && { region: { contains: filters.region, mode: "insensitive" as const } }),
    // Фільтр по типу Unit
    ...(filters.unitType && {
      units: { some: { type: filters.unitType } },
    }),
    // Фільтр по ціні
    ...(filters.priceMin || filters.priceMax
      ? {
        units: {
          some: {
            pricePerNight: {
              ...(filters.priceMin && { gte: filters.priceMin }),
              ...(filters.priceMax && { lte: filters.priceMax }),
            },
          },
        },
      }
      : {}),
  }

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { ratingAvg: "desc" },
      include: {
        amenities: { select: { icon: true, label: true } },
        units: {
          select: {
            pricePerNight: true,
            images: {
              select: { url: true },
              orderBy: { order: "asc" },
              take: 4,
            },
          },
        },
      },
    }),
    prisma.property.count({ where }),
  ])

  const items: PropertyCard[] = properties.map((p) => {
    const prices = p.units.map((u) => toNumber(u.pricePerNight))
    const allImages = p.units.flatMap((u) => u.images.map((i) => i.url))

    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      city: p.city,
      region: p.region,
      coverImage: p.coverImage,
      ratingAvg: p.ratingAvg,
      ratingCount: p.ratingCount,
      latitude: p.latitude,
      longitude: p.longitude,
      minPrice: prices.length > 0 ? Math.min(...prices) : 0,
      previewImages: allImages.slice(0, 4),
      amenities: p.amenities,
    }
  })

  return { items, total }
}

/**
 * Повна інформація про об'єкт для сторінки /p/[slug]
 */
export async function getPropertyBySlug(
  slug: string
): Promise<PropertyDetail | null> {
  const property = await prisma.property.findUnique({
    where: { slug, isActive: true, isHidden: false },
    include: {
      amenities: true,
      units: {
        include: {
          images: { orderBy: { order: "asc" } },
          amenities: true,
        },
        orderBy: { createdAt: "asc" },
      },
    },
  })

  if (!property) return null

  // Конвертуємо Decimal → number у units
  return {
    ...property,
    units: property.units.map((u) => ({
      ...u,
      pricePerNight: toNumber(u.pricePerNight),
    })),
  } as PropertyDetail
}

/**
 * Пошук об'єктів в радіусі (використовує raw SQL з PostGIS)
 * Потребує: CREATE EXTENSION IF NOT EXISTS postgis;
 */
export async function getPropertiesNearby(
  lat: number,
  lng: number,
  radiusKm = 20
): Promise<PropertyCard[]> {
  // Використовуємо Haversine формулу через raw SQL
  // (PostGIS дає кращу продуктивність, але і без нього працює для MVP)
  const properties = await prisma.$queryRaw<
    Array<{ id: string; distance_km: number }>
  >`
    SELECT id,
      (6371 * acos(
        cos(radians(${lat})) * cos(radians(latitude)) *
        cos(radians(longitude) - radians(${lng})) +
        sin(radians(${lat})) * sin(radians(latitude))
      )) AS distance_km
    FROM properties
    WHERE
      is_active = true AND
      is_hidden = false AND
      latitude IS NOT NULL AND
      longitude IS NOT NULL
    HAVING distance_km < ${radiusKm}
    ORDER BY distance_km
    LIMIT 20
  `

  if (properties.length === 0) return []

  const ids = properties.map((p) => p.id)
  const { items } = await getProperties({}, 1, 20)

  // Фільтруємо і сортуємо за дистанцією
  return items
    .filter((p) => ids.includes(p.id))
    .sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id))
}
