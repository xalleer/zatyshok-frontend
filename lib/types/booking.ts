// lib/types/booking.ts
// Типи для флоу бронювання

import type { Booking, BookingStatus, PaymentMethod } from "@/lib/generated/prisma"

// ─── Booking Flow State ───────────────────────────────────────────────────────

/**
 * Кроки флоу бронювання в BookingSheet
 */
export type BookingStep =
  | "dates"     // вибір дат в Calendar
  | "details"   // Ім'я, Телефон, Коментар
  | "payment"   // вибір методу оплати
  | "confirm"   // підтвердження / очікування

/**
 * Стан флоу бронювання (в хуку useBooking)
 */
export type BookingState = {
  step: BookingStep
  unitId: string | null
  checkIn: Date | null
  checkOut: Date | null
  guestName: string
  guestPhone: string
  guestComment: string
  paymentMethod: PaymentMethod | null
  /** ID бронювання після створення (HOLD) */
  bookingId: string | null
  /** До якого часу HOLD активний */
  holdExpiresAt: Date | null
}

// ─── API Payloads ─────────────────────────────────────────────────────────────

/**
 * Тіло POST /api/bookings
 */
export type CreateBookingPayload = {
  unitId: string
  checkIn: string  // "YYYY-MM-DD"
  checkOut: string // "YYYY-MM-DD"
  guestName: string
  guestPhone: string
  guestComment?: string
  paymentMethod: PaymentMethod
}

/**
 * Відповідь POST /api/bookings
 */
export type CreateBookingResponse = {
  bookingId: string
  status: BookingStatus
  totalAmount: number
  prepaidAmount: number
  holdExpiresAt: string | null
  /** URL для переходу на оплату (якщо онлайн) */
  paymentUrl: string | null
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

/**
 * Бронювання в таблиці адмінки
 */
export type BookingRow = Pick<
  Booking,
  | "id"
  | "createdAt"
  | "checkIn"
  | "checkOut"
  | "status"
  | "guestName"
  | "guestPhone"
  | "totalAmount"
  | "prepaidAmount"
  | "paymentMethod"
> & {
  unitName: string
  propertyName: string
}

// ─── Re-exports ───────────────────────────────────────────────────────────────

export { BookingStatus, PaymentMethod }
