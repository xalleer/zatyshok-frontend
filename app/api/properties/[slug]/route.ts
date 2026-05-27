
import { NextRequest, NextResponse } from "next/server"
import { getPropertyBySlug } from "@/lib/api/properties"
import { apiSuccess, apiError } from "@/lib/types/api"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    if (!slug) {
      return NextResponse.json(apiError("Slug обов'язковий"), { status: 400 })
    }

    const property = await getPropertyBySlug(slug)

    if (!property) {
      return NextResponse.json(apiError("Об'єкт не знайдено"), { status: 404 })
    }

    return NextResponse.json(apiSuccess(property))
  } catch (error) {
    console.error("[GET /api/properties/:slug]", error)
    return NextResponse.json(apiError("Помилка сервера"), { status: 500 })
  }
}
