import { NextRequest, NextResponse } from "next/server"
import { releaseExpiredHolds, markCompletedBookings } from "@/lib/api/availability"
import { apiSuccess, apiError } from "@/lib/types/api"

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(apiError("Unauthorized"), { status: 401 })
    }

    const [releasedHolds, completedBookings] = await Promise.all([
      releaseExpiredHolds(),
      markCompletedBookings(),
    ])

    console.log(`[CRON] Released ${releasedHolds} expired HOLDs, marked ${completedBookings} bookings as COMPLETED`)

    return NextResponse.json(
      apiSuccess({ releasedHolds, completedBookings })
    )
  } catch (error) {
    console.error("[POST /api/cron/cleanup]", error)
    return NextResponse.json(apiError("Помилка сервера"), { status: 500 })
  }
}

export const GET = POST
