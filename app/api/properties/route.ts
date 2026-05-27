
import { NextRequest, NextResponse } from "next/server"
import { getProperties, getPropertiesNearby } from "@/lib/api/properties"
import { apiSuccess, apiError } from "@/lib/types/api"
import type { PropertyFilters } from "@/lib/types/property"
import { UnitType } from "@/lib/generated/prisma/enums"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl

    const page = Math.max(1, Number(searchParams.get("page") ?? 1))
    const pageSize = Math.min(50, Math.max(1, Number(searchParams.get("pageSize") ?? 20)))

    const latParam = searchParams.get("lat")
    const lngParam = searchParams.get("lng")

    if (latParam && lngParam) {
      const lat = parseFloat(latParam)
      const lng = parseFloat(lngParam)
      const radiusKm = parseFloat(searchParams.get("radiusKm") ?? "20")

      if (isNaN(lat) || isNaN(lng)) {
        return NextResponse.json(apiError("Некоректні координати"), { status: 400 })
      }

      const items = await getPropertiesNearby(lat, lng, radiusKm)
      return NextResponse.json(
        apiSuccess({ items, total: items.length, page: 1, pageSize: items.length, hasMore: false })
      )
    }

    const unitTypeParam = searchParams.get("unitType")
    const unitType =
      unitTypeParam && Object.values(UnitType).includes(unitTypeParam as UnitType)
        ? (unitTypeParam as UnitType)
        : undefined

    const filters: PropertyFilters = {
      city: searchParams.get("city") ?? undefined,
      region: searchParams.get("region") ?? undefined,
      unitType,
      priceMin: searchParams.get("priceMin") ? Number(searchParams.get("priceMin")) : undefined,
      priceMax: searchParams.get("priceMax") ? Number(searchParams.get("priceMax")) : undefined,
    }

    const { items, total } = await getProperties(filters, page, pageSize)

    return NextResponse.json(
      apiSuccess({
        items,
        total,
        page,
        pageSize,
        hasMore: page * pageSize < total,
      })
    )
  } catch (error) {
    console.error("[GET /api/properties]", error)
    return NextResponse.json(apiError("Помилка сервера"), { status: 500 })
  }
}
