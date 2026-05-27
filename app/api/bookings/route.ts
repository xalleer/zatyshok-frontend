import { NextRequest, NextResponse } from "next/server"
import { createBooking } from "@/lib/api/bookings"
import { apiSuccess, apiError } from "@/lib/types/api"
import { PaymentMethod } from "@/lib/generated/prisma"
import type { CreateBookingPayload } from "@/lib/types/booking"

// Проста валідація без зовнішніх бібліотек (zod можна додати пізніше)
function validatePayload(body: unknown): body is CreateBookingPayload {
  if (!body || typeof body !== "object") return false
  const b = body as Record<string, unknown>

  return (
    typeof b.unitId === "string" && b.unitId.length > 0 &&
    typeof b.checkIn === "string" && /^\d{4}-\d{2}-\d{2}$/.test(b.checkIn) &&
    typeof b.checkOut === "string" && /^\d{4}-\d{2}-\d{2}$/.test(b.checkOut) &&
    typeof b.guestName === "string" && b.guestName.trim().length >= 2 &&
    typeof b.guestPhone === "string" && b.guestPhone.trim().length >= 10 &&
    (b.paymentMethod === PaymentMethod.ONLINE || b.paymentMethod === PaymentMethod.CASH)
  )
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!validatePayload(body)) {
      return NextResponse.json(
        apiError("Некоректні дані", {
          unitId: !body?.unitId ? "Оберіть об'єкт" : "",
          checkIn: !body?.checkIn ? "Оберіть дату заїзду" : "",
          checkOut: !body?.checkOut ? "Оберіть дату виїзду" : "",
          guestName: !body?.guestName ? "Введіть ім'я" : "",
          guestPhone: !body?.guestPhone ? "Введіть телефон" : "",
        }),
        { status: 422 }
      )
    }

    // TODO: отримати userId з сесії next-auth якщо авторизований
    // const session = await auth()
    // const userId = session?.user?.id

    const result = await createBooking(body)

    return NextResponse.json(apiSuccess(result), { status: 201 })
  } catch (error) {
    console.error("[POST /api/bookings]", error)

    if (error instanceof Error && error.message.includes("зайняті")) {
      return NextResponse.json(apiError(error.message), { status: 409 })
    }

    return NextResponse.json(apiError("Помилка сервера"), { status: 500 })
  }
}
