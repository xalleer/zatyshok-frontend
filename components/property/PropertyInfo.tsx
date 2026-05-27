// components/property/PropertyInfo.tsx
// Інформаційний блок: назва, локація, рейтинг, бейджі послуг, опис

import { MapPin } from "lucide-react"
import { StarRating } from "@/components/shared/StarRating"
import { AmenityBadge } from "@/components/property/AmenityBadge"
import type { PropertyDetail } from "@/lib/types/property"

type PropertyInfoProps = {
  property: PropertyDetail
}

export function PropertyInfo({ property }: PropertyInfoProps) {
  const location = [property.city, property.region].filter(Boolean).join(", ")

  return (
    <div className="space-y-4">
      {/* Назва + рейтинг */}
      <div className="flex items-start justify-between gap-3">
        <h1 className="font-heading text-2xl font-semibold leading-tight text-foreground md:text-3xl">
          {property.name}
        </h1>
        {property.ratingAvg > 0 && (
          <StarRating
            rating={property.ratingAvg}
            count={property.ratingCount}
            size="md"
            className="shrink-0 mt-1"
          />
        )}
      </div>

      {/* Локація */}
      {location && (
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <MapPin className="size-4 shrink-0" />
          <span className="text-sm">{location}</span>
        </div>
      )}

      {/* Бейджі послуг */}
      {property.amenities.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {property.amenities.map((amenity) => (
            <AmenityBadge
              key={amenity.id}
              icon={amenity.icon}
              label={amenity.label}
            />
          ))}
        </div>
      )}

      {/* Розділювач */}
      <div className="border-t border-border" />

      {/* Опис */}
      {property.description && (
        <div>
          <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
            {property.description}
          </p>
        </div>
      )}
    </div>
  )
}
