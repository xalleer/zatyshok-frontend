import { cn } from "@/lib/utils"

type PriceDisplayProps = {
  amount: number
  period?: "night" | "day" | "total"
  prefix?: "від" | "за"
  size?: "sm" | "md" | "lg"
  className?: string
}

const PERIOD_LABELS: Record<NonNullable<PriceDisplayProps["period"]>, string> = {
  night: "/ ніч",
  day: "/ день",
  total: "всього",
}

export function PriceDisplay({
                               amount,
                               period,
                               prefix,
                               size = "md",
                               className,
                             }: PriceDisplayProps) {
  const formatted = new Intl.NumberFormat("uk-UA", {
    style: "currency",
    currency: "UAH",
    maximumFractionDigits: 0,
  }).format(amount)

  return (
    <span
      className={cn(
        "inline-flex items-baseline gap-1",
        size === "sm" && "text-sm",
        size === "md" && "text-base",
        size === "lg" && "text-xl",
        className
      )}
    >
      {prefix && (
        <span className="text-muted-foreground font-normal text-[0.85em]">
          {prefix}
        </span>
      )}
      <span className="font-semibold tabular-nums">{formatted}</span>
      {period && (
        <span className="text-muted-foreground font-normal text-[0.8em]">
          {PERIOD_LABELS[period]}
        </span>
      )}
    </span>
  )
}
