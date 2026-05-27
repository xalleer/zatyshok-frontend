import { NextRequest, NextResponse } from "next/server"
import { cancelBooking } from "@/lib/api/bookings"
import { apiSuccess, apiError } from "@/lib/types/api"

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: bookingId } = await params

    // TODO: отримати userId з next-auth сесії
    // const session = await auth()
    // if (!session?.user?.id) {
    //   return NextResponse.json(apiError("Не авторизовано"), { status: 401 })
    // }

    // Тимчасово для MVP — дозволяємо без авторизації (виправити після auth)
    const TEMP_USER_ID = "temp"

    await cancelBooking(bookingId, TEMP_USER_ID)

    return NextResponse.json(apiSuccess({ cancelled: true }))
  } catch (error) {
    console.error("[POST /api/bookings/:id/cancel]", error)

    if (error instanceof Error) {
      const status = error.message.includes("не знайдено") ? 404
        : error.message.includes("доступу") ? 403
          : error.message.includes("Неможливо") ? 400
            : 500

      return NextResponse.json(apiError(error.message), { status })
    }

    return NextResponse.json(apiError("Помилка сервера"), { status: 500 })
  }
}
