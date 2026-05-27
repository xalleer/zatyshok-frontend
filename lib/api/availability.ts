import { prisma } from "@/lib/prisma"
import { BookingStatus } from "@/lib/generated/prisma/enums"
import { format, eachDayOfInterval, parseISO } from "date-fns"

// ─── Availability ─────────────────────────────────────────────────────────────

/**
 * Повертає масив недоступних дат для Unit у форматі "YYYY-MM-DD"
 * Враховує: підтверджені бронювання + HOLD + ручні блокування
 */
export async function getUnavailableDates(unitId: string): Promise<string[]> {
  const now = new Date()

  const [bookings, blockedDates] = await Promise.all([
    prisma.booking.findMany({
      where: {
        unitId,
        status: {
          in: [BookingStatus.CONFIRMED, BookingStatus.HOLD, BookingStatus.PENDING],
        },
        // Тільки майбутні / поточні
        checkOut: { gte: now },
      },
      select: { checkIn: true, checkOut: true },
    }),
    prisma.blockedDate.findMany({
      where: {
        unitId,
        date: { gte: now },
      },
      select: { date: true },
    }),
  ])

  const unavailable = new Set<string>()

  // Дати з бронювань
  for (const booking of bookings) {
    const days = eachDayOfInterval({
      start: booking.checkIn,
      end: booking.checkOut,
    })
    for (const day of days) {
      unavailable.add(format(day, "yyyy-MM-dd"))
    }
  }

  // Ручно заблоковані дати
  for (const blocked of blockedDates) {
    unavailable.add(format(blocked.date, "yyyy-MM-dd"))
  }

  return Array.from(unavailable)
}

/**
 * Перевіряє, чи вільні конкретні дати для Unit
 */
export async function checkDatesAvailable(
  unitId: string,
  checkIn: Date,
  checkOut: Date
): Promise<boolean> {
  const conflicting = await prisma.booking.findFirst({
    where: {
      unitId,
      status: {
        in: [BookingStatus.CONFIRMED, BookingStatus.HOLD],
      },
      OR: [
        // Нове бронювання починається всередині існуючого
        { checkIn: { lte: checkIn }, checkOut: { gt: checkIn } },
        // Нове бронювання закінчується всередині існуючого
        { checkIn: { lt: checkOut }, checkOut: { gte: checkOut } },
        // Нове бронювання повністю перекриває існуюче
        { checkIn: { gte: checkIn }, checkOut: { lte: checkOut } },
      ],
    },
  })

  return conflicting === null
}

// ─── HOLD Cleanup ─────────────────────────────────────────────────────────────

/**
 * Очищує прострочені HOLD бронювання
 * Викликається з cron job (або /api/cron/cleanup)
 */
export async function releaseExpiredHolds(): Promise<number> {
  const result = await prisma.booking.updateMany({
    where: {
      status: BookingStatus.HOLD,
      holdExpiresAt: { lt: new Date() },
    },
    data: {
      status: BookingStatus.CANCELLED,
    },
  })

  return result.count
}

/**
 * Позначає завершені бронювання як COMPLETED
 * (checkOut минув + статус CONFIRMED)
 */
export async function markCompletedBookings(): Promise<number> {
  const result = await prisma.booking.updateMany({
    where: {
      status: BookingStatus.CONFIRMED,
      checkOut: { lt: new Date() },
    },
    data: {
      status: BookingStatus.COMPLETED,
    },
  })

  return result.count
}
