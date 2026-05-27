"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react"
import { StarRating } from "@/components/shared/StarRating"
import { PriceDisplay } from "@/components/shared/PriceDisplay"
import { cn } from "@/lib/utils"
import type { PropertyCard as PropertyCardType } from "@/lib/types/property"

type PropertyCardProps = {
  property: PropertyCardType
  className?: string
}

export function PropertyCard({ property, className }: PropertyCardProps) {
  const [photoIndex, setPhotoIndex] = useState(0)

  const photos =
    property.previewImages.length > 0
      ? property.previewImages
      : [property.coverImage].filter(Boolean) as string[]

  const hasMultiplePhotos = photos.length > 1

  const prevPhoto = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setPhotoIndex((i) => (i - 1 + photos.length) % photos.length)
  }

  const nextPhoto = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setPhotoIndex((i) => (i + 1) % photos.length)
  }

  return (
    <Link
      href={`/p/${property.slug}`}
      className={cn("group block", className)}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
        {photos.length > 0 ? (
          <Image
            src={photos[photoIndex]}
            alt={property.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            priority={false}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[var(--moss)]/20 to-[var(--forest)]/10">
            <span className="text-4xl opacity-30">🌿</span>
          </div>
        )}

        {hasMultiplePhotos && (
          <>
            <button
              onClick={prevPhoto}
              aria-label="Попереднє фото"
              className={cn(
                "absolute left-2 top-1/2 -translate-y-1/2 z-10",
                "size-7 rounded-full bg-white/90 shadow-sm",
                "flex items-center justify-center",
                "opacity-0 group-hover:opacity-100 transition-opacity",
                "sm:opacity-0 opacity-100 sm:group-hover:opacity-100"
              )}
            >
              <ChevronLeft className="size-4 text-foreground" />
            </button>
            <button
              onClick={nextPhoto}
              aria-label="Наступне фото"
              className={cn(
                "absolute right-2 top-1/2 -translate-y-1/2 z-10",
                "size-7 rounded-full bg-white/90 shadow-sm",
                "flex items-center justify-center",
                "opacity-0 group-hover:opacity-100 transition-opacity",
                "sm:opacity-0 opacity-100 sm:group-hover:opacity-100"
              )}
            >
              <ChevronRight className="size-4 text-foreground" />
            </button>

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
              {photos.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "rounded-full transition-all",
                    i === photoIndex
                      ? "w-4 h-1.5 bg-white"
                      : "w-1.5 h-1.5 bg-white/60"
                  )}
                />
              ))}
            </div>
          </>
        )}

        {property.amenities.length > 0 && (
          <div className="absolute top-2.5 left-2.5 flex gap-1 flex-wrap max-w-[70%]">
            {property.amenities.slice(0, 3).map((amenity) => (
              <span
                key={amenity.label}
                className="inline-flex items-center gap-0.5 rounded-full bg-white/90 px-2 py-0.5 text-xs font-medium text-foreground shadow-sm"
              >
                {amenity.label}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-2.5 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-heading font-medium text-sm leading-snug line-clamp-1 text-foreground group-hover:text-[var(--forest)] transition-colors">
            {property.name}
          </h3>
          {property.ratingAvg > 0 && (
            <StarRating
              rating={property.ratingAvg}
              size="sm"
              className="shrink-0"
            />
          )}
        </div>

        {(property.city || property.region) && (
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="size-3 shrink-0" />
            <span className="text-xs line-clamp-1">
              {[property.city, property.region].filter(Boolean).join(", ")}
            </span>
          </div>
        )}

        {property.minPrice > 0 && (
          <PriceDisplay
            amount={property.minPrice}
            period="night"
            prefix="від"
            size="sm"
          />
        )}
      </div>
    </Link>
  )
}
