
"use client"

import { LocateFixed, Loader2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useGeolocation } from "@/hooks/useGeolocation"

type NearbyButtonProps = {
  onLocationFound: (lat: number, lng: number) => void
  onReset: () => void
  isActive: boolean
  className?: string
}

export function NearbyButton({
                               onLocationFound,
                               onReset,
                               isActive,
                               className,
                             }: NearbyButtonProps) {
  const { state, request } = useGeolocation()

  const handleClick = () => {
    if (isActive) {
      onReset()
      return
    }

    if (state.status === "success") {
      onLocationFound(state.lat, state.lng)
      return
    }

    request()
  }

  if (state.status === "success" && !isActive) {
    onLocationFound(state.lat, state.lng)
  }

  const isLoading = state.status === "loading"
  const hasError = state.status === "error"

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <button
        onClick={handleClick}
        disabled={isLoading}
        className={cn(
          "inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2",
          "text-sm font-medium transition-all duration-200 border",
          "disabled:opacity-60 disabled:cursor-not-allowed",
          isActive
            ? "bg-[var(--forest)] text-white border-[var(--forest)]"
            : "bg-white text-foreground border-border hover:border-[var(--forest)]/40 hover:bg-[var(--forest)]/5"
        )}
      >
        {isLoading ? (
          <Loader2 className="size-4 animate-spin shrink-0" />
        ) : isActive ? (
          <X className="size-4 shrink-0" />
        ) : (
          <LocateFixed className="size-4 shrink-0" />
        )}
        <span className="whitespace-nowrap">
          {isActive ? "Скинути" : "Недалеко від мене"}
        </span>
      </button>

      {hasError && (
        <p className="text-xs text-destructive px-1">
          {state.message}
        </p>
      )}
    </div>
  )
}
