
import { NextRequest, NextResponse } from "next/server"
import { getUnavailableDates } from "@/lib/api/availability"
import { apiSuccess, apiError } from "@/lib/types/api"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: unitId } = await params

    if (!unitId) {
      return NextResponse.json(apiError("ID юніта обов'язковий"), { status: 400 })
    }

    const unavailableDates = await getUnavailableDates(unitId)

    return NextResponse.json(
      apiSuccess({ unitId, unavailableDates })
    )
  } catch (error) {
    console.error("[GET /api/units/:id/availability]", error)
    return NextResponse.json(apiError("Помилка сервера"), { status: 500 })
  }
}
