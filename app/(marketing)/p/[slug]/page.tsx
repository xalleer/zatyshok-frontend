// app/(marketing)/p/[slug]/page.tsx
// Сторінка об'єкта — найважливіший екран платформи
// Server Component: SEO + OpenGraph + дані з БД

import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getPropertyBySlug } from "@/lib/api/properties"
import { PropertyHero } from "@/components/property/PropertyHero"
import { PropertyInfo } from "@/components/property/PropertyInfo"
import { UnitList } from "@/components/property/UnitList"

type Props = {
  params: Promise<{ slug: string }>
}

// ─── OpenGraph / SEO ──────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const property = await getPropertyBySlug(slug)

  if (!property) {
    return { title: "Об'єкт не знайдено" }
  }

  const minPrice = property.units.length > 0
    ? Math.min(...property.units.map((u) => u.pricePerNight))
    : null

  const description = property.description
    ?? `${property.name} — бронювання онлайн на Затишок. ${minPrice ? `Від ${minPrice} ₴/ніч.` : ""}`

  const ogImage = property.coverImage
    ?? property.units[0]?.images[0]?.url
    ?? "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=1200&q=80"

  return {
    title: property.name,
    description,
    openGraph: {
      title: property.name,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: property.name }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: property.name,
      description,
      images: [ogImage],
    },
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function PropertyPage({ params }: Props) {
  const { slug } = await params
  const property = await getPropertyBySlug(slug)

  if (!property) notFound()

  // Всі фото з усіх units для hero-галереї
  const allPhotos = [
    ...(property.coverImage ? [property.coverImage] : []),
    ...property.units.flatMap((u) => u.images.map((i) => i.url)),
  ].filter(Boolean).slice(0, 10)

  return (
    // На мобільному — немає відступів зверху (hero повноекранний)
    <div className="min-h-screen bg-background">

      {/* Hero — swiper фото */}
      <PropertyHero
        photos={allPhotos}
        name={property.name}
        slug={slug}
      />

      {/* Основний контент */}
      <div className="mx-auto max-w-6xl px-4 pb-32 lg:pb-16">
        <div className="lg:grid lg:grid-cols-[1fr_380px] lg:gap-10 lg:items-start">

          {/* Ліва колонка: інфо + юніти */}
          <div className="space-y-8 pt-5">
            <PropertyInfo property={property} />
            <UnitList property={property} />
          </div>

          {/* Права колонка: sticky booking card (тільки десктоп) */}
          {/* На мобільному — floating bar знизу, рендериться в UnitList */}
          <div className="hidden lg:block">
            <div className="sticky top-20 pt-5">
              {/* Sticky card рендериться всередині UnitList як десктоп-варіант */}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
