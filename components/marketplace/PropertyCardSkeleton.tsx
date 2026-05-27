
import { cn } from "@/lib/utils"

type PropertyCardSkeletonProps = {
  className?: string
}

export function PropertyCardSkeleton({ className }: PropertyCardSkeletonProps) {
  return (
    <div className={cn("animate-pulse", className)}>
      <div className="aspect-[4/3] rounded-2xl bg-muted" />

      <div className="mt-2.5 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="h-4 w-3/5 rounded-md bg-muted" />
          <div className="h-3 w-10 rounded-md bg-muted" />
        </div>
        <div className="h-3 w-2/5 rounded-md bg-muted" />
        <div className="h-3 w-1/4 rounded-md bg-muted" />
      </div>
    </div>
  )
}
