"use client"

import { cn } from "@/lib/utils"
import { UnitType } from "@/lib/generated/prisma"

type Category = {
  type: UnitType | null
  label: string
  emoji: string
}

const CATEGORIES: Category[] = [
  { type: null,           label: "Всі",       emoji: "🏕️" },
  { type: UnitType.HOUSE,    label: "Будиночки", emoji: "🏡" },
  { type: UnitType.GLAMPING, label: "Глемпінги", emoji: "⛺" },
  { type: UnitType.GAZEBO,   label: "Альтанки",  emoji: "🛖" },
  { type: UnitType.AFRAME,   label: "A-Frame",   emoji: "🔺" },
  { type: UnitType.TENT,     label: "Намети",    emoji: "🏕" },
]

type CategoryFilterProps = {
  selected: UnitType | null
  onChange: (type: UnitType | null) => void
  className?: string
}

export function CategoryFilter({ selected, onChange, className }: CategoryFilterProps) {
  return (
    <div
      className={cn(
        "flex gap-2 overflow-x-auto hide-scrollbar pb-1",
        className
      )}
      role="group"
      aria-label="Фільтр типу об'єкта"
    >
      {CATEGORIES.map((cat) => {
        const isActive = selected === cat.type

        return (
          <button
            key={cat.label}
            onClick={() => onChange(cat.type)}
            aria-pressed={isActive}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2",
              "text-sm font-medium transition-all duration-200",
              "border whitespace-nowrap",
              isActive
                ? "bg-[var(--forest)] text-white border-[var(--forest)] shadow-sm"
                : "bg-white text-foreground border-border hover:border-[var(--forest)]/40 hover:bg-[var(--forest)]/5"
            )}
          >
            <span className="text-base leading-none">{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        )
      })}
    </div>
  )
}
