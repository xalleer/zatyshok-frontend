// components/property/AmenityBadge.tsx
// Бейдж послуги з іконкою Lucide

import * as LucideIcons from "lucide-react"
import { cn } from "@/lib/utils"

type AmenityBadgeProps = {
  icon: string   // назва іконки lucide: "wifi", "flame", "fish"
  label: string
  size?: "sm" | "md"
  className?: string
}

export function AmenityBadge({ icon, label, size = "md", className }: AmenityBadgeProps) {
  // Динамічно отримуємо іконку з Lucide
  const iconName = icon
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("") as keyof typeof LucideIcons

  const Icon = (LucideIcons[iconName] as React.ComponentType<{ className?: string }>) ?? LucideIcons.Star

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50",
        "font-medium text-foreground",
        size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm",
        className
      )}
    >
      <Icon className={cn(size === "sm" ? "size-3" : "size-3.5", "text-[var(--forest)]")} />
      {label}
    </span>
  )
}
