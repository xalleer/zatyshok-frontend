import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

type StarRatingProps = {
  rating: number
  count?: number
  size?: "sm" | "md"
  className?: string
}

export function StarRating({ rating, count, size = "sm", className }: StarRatingProps) {
  const filled = Math.floor(rating)
  const hasHalf = rating - filled >= 0.5
  const starSize = size === "sm" ? "size-3" : "size-4"

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={cn(
              starSize,
              "transition-colors",
              i < filled
                ? "fill-amber-400 text-amber-400"
                : i === filled && hasHalf
                  ? "fill-amber-400/50 text-amber-400"
                  : "fill-transparent text-muted-foreground/40"
            )}
          />
        ))}
      </div>

      {rating > 0 && (
        <span
          className={cn(
            "font-medium tabular-nums text-foreground",
            size === "sm" ? "text-xs" : "text-sm"
          )}
        >
          {rating.toFixed(1)}
        </span>
      )}

      {count !== undefined && count > 0 && (
        <span
          className={cn(
            "text-muted-foreground",
            size === "sm" ? "text-xs" : "text-sm"
          )}
        >
          ({count})
        </span>
      )}
    </div>
  )
}
