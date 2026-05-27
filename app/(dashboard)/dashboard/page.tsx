// app/(dashboard)/dashboard/page.tsx
// Головна адмінки — таблиця бронювань

import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { BookingStatus } from "@/lib/generated/prisma/enums"
import { format } from "date-fns"
import { uk } from "date-fns/locale"
import { cn } from "@/lib/utils"

const STATUS_CONFIG: Record<BookingStatus, { label: string; className: string }> = {
  [BookingStatus.PENDING]: {
    label: "Очікує",
    className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  [BookingStatus.HOLD]: {
    label: "HOLD",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  },
  [BookingStatus.CONFIRMED]: {
    label: "Підтверджено",
    className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
  [BookingStatus.CANCELLED]: {
    label: "Скасовано",
    className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  },
  [BookingStatus.COMPLETED]: {
    label: "Завершено",
    className: "bg-muted text-muted-foreground",
  },
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/auth/login?callbackUrl=/dashboard")

  // Знаходимо property власника
  const property = await prisma.property.findFirst({
    where: { hostId: session.user.id },
    select: { id: true, name: true, slug: true, isActive: true },
  })

  // Отримуємо останні бронювання
  const bookings = property
    ? await prisma.booking.findMany({
      where: {
        unit: { propertyId: property.id },
      },
      include: {
        unit: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    })
    : []

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === BookingStatus.PENDING || b.status === BookingStatus.HOLD).length,
    confirmed: bookings.filter((b) => b.status === BookingStatus.CONFIRMED).length,
  }

  return (
    <div className="space-y-6 max-w-5xl">

      {/* Заголовок */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">
            {property ? property.name : "Мій об'єкт"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {property?.isActive
              ? "Ваш об'єкт активний і відображається на маркетплейсі"
              : "Об'єкт ще не активований — заповніть профіль"}
          </p>
        </div>
        {property && (
          <a
            href={`/p/${property.slug}`}
            target="_blank"
            className="shrink-0 text-sm text-[var(--forest)] hover:underline underline-offset-4"
          >
            Моя сторінка →
          </a>
        )}
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Всього" value={stats.total} />
        <StatCard label="Очікують" value={stats.pending} highlight />
        <StatCard label="Підтверджено" value={stats.confirmed} />
      </div>

      {/* Таблиця бронювань */}
      <div>
        <h2 className="font-heading text-base font-medium text-foreground mb-3">
          Останні бронювання
        </h2>

        {bookings.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border py-16 text-center">
            <p className="text-sm text-muted-foreground">
              Поки що немає бронювань
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-foreground">Гість</th>
                  <th className="text-left px-4 py-3 font-medium text-foreground">Юніт</th>
                  <th className="text-left px-4 py-3 font-medium text-foreground">Заїзд</th>
                  <th className="text-left px-4 py-3 font-medium text-foreground">Виїзд</th>
                  <th className="text-right px-4 py-3 font-medium text-foreground">Сума</th>
                  <th className="text-left px-4 py-3 font-medium text-foreground">Статус</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-border">
                {bookings.map((booking) => {
                  const status = STATUS_CONFIG[booking.status]
                  return (
                    <tr
                      key={booking.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-foreground">{booking.guestName ?? "—"}</p>
                          <p className="text-xs text-muted-foreground">{booking.guestPhone ?? ""}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {booking.unit.name}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {format(booking.checkIn, "d MMM", { locale: uk })}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {format(booking.checkOut, "d MMM", { locale: uk })}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-foreground">
                        {parseFloat(String(booking.totalAmount)).toLocaleString("uk-UA")} ₴
                      </td>
                      <td className="px-4 py-3">
                          <span className={cn(
                            "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                            status.className
                          )}>
                            {status.label}
                          </span>
                      </td>
                    </tr>
                  )
                })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}

function StatCard({
                    label,
                    value,
                    highlight = false,
                  }: {
  label: string
  value: number
  highlight?: boolean
}) {
  return (
    <div className={cn(
      "rounded-xl border p-4",
      highlight && value > 0
        ? "border-yellow-200 bg-yellow-50 dark:border-yellow-900/50 dark:bg-yellow-900/10"
        : "border-border bg-card"
    )}>
      <p className="text-2xl font-heading font-semibold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  )
}
