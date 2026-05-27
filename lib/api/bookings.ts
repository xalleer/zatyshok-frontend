// lib/api/bookings.ts
// Server-side функції для створення та управління бронюваннями

import { prisma } from "@/lib/prisma"
import { BookingStatus, PaymentMethod } from "@/lib/generated/prisma/enums"
import { checkDatesAvailable } from "@/lib/api/availability"
import { parseISO, differenceInCalendarDays } from "date-fns"
import type { CreateBookingPayload, CreateBookingResponse } from "@/lib/types/booking"

// HOLD активний 15 хвилин
const HOLD_DURATION_MS = 15 * 60 * 1000

// ─── Create Booking ───────────────────────────────────────────────────────────

export async function createBooking(
  payload: CreateBookingPayload,
  userId?: string
): Promise<CreateBookingResponse> {
  const { unitId, checkIn: checkInStr, checkOut: checkOutStr, paymentMethod } = payload

  const checkIn = parseISO(checkInStr)
  const checkOut = parseISO(checkOutStr)

  // 1. Перевіряємо доступність
  const isAvailable = await checkDatesAvailable(unitId, checkIn, checkOut)
  if (!isAvailable) {
    throw new Error("Обрані дати вже зайняті. Спробуйте інші.")
  }

  // 2. Отримуємо Unit з ціною
  const unit = await prisma.unit.findUnique({
    where: { id: unitId },
    select: {
      pricePerNight: true,
      property: {
        select: {
          cancellationPolicy: true,
          bookingMode: true,
        },
      },
    },
  })

  if (!unit) throw new Error("Об'єкт не знайдений")

  // 3. Розраховуємо суму
  const nights = differenceInCalendarDays(checkOut, checkIn)
  if (nights < 1) throw new Error("Некоректні дати")

  const pricePerNight = parseFloat(String(unit.pricePerNight))
  const totalAmount = pricePerNight * nights

  // Передоплата = 50% від суми (для онлайн оплати)
  const prepaidAmount =
    paymentMethod === PaymentMethod.ONLINE
      ? Math.round(totalAmount * 0.5)
      : 0

  // 4. Визначаємо початковий статус
  // HOLD — якщо онлайн оплата (чекаємо на платіж)
  // PENDING — якщо готівка (чекаємо підтвердження власника, якщо REQUEST mode)
  const isHoldNeeded = paymentMethod === PaymentMethod.ONLINE
  const holdExpiresAt = isHoldNeeded
    ? new Date(Date.now() + HOLD_DURATION_MS)
    : null

  const status = isHoldNeeded
    ? BookingStatus.HOLD
    : BookingStatus.PENDING

  // 5. Створюємо бронювання в транзакції
  const booking = await prisma.booking.create({
    data: {
      unitId,
      userId: userId ?? null,
      checkIn,
      checkOut,
      status,
      guestName: payload.guestName,
      guestPhone: payload.guestPhone,
      guestComment: payload.guestComment,
      paymentMethod,
      totalAmount,
      prepaidAmount,
      holdExpiresAt,
    },
  })

  // TODO: Крок 6 — відправити сповіщення власнику через Telegram Bot

  return {
    bookingId: booking.id,
    status: booking.status,
    totalAmount,
    prepaidAmount,
    holdExpiresAt: holdExpiresAt?.toISOString() ?? null,
    // TODO: для онлайн оплати — отримати URL від платіжної системи
    paymentUrl: null,
  }
}

// ─── Cancel Booking ───────────────────────────────────────────────────────────

export async function cancelBooking(
  bookingId: string,
  requestedByUserId: string
): Promise<void> {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { transaction: true },
  })

  if (!booking) throw new Error("Бронювання не знайдено")

  // Перевірка доступу
  if (booking.userId !== requestedByUserId) {
    throw new Error("Немає доступу до цього бронювання")
  }

  if (
    booking.status === BookingStatus.CANCELLED ||
    booking.status === BookingStatus.COMPLETED
  ) {
    throw new Error("Неможливо скасувати це бронювання")
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: BookingStatus.CANCELLED },
  })

  // TODO: якщо була онлайн оплата — ініціювати Refund через API платіжної системи
}
