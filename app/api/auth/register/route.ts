// app/api/auth/register/route.ts
// Реєстрація нового власника бази відпочинку
// POST /api/auth/register
// Створює: User (role=HOST) + Property (slug, name)

import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { apiSuccess, apiError } from "@/lib/types/api"
import { Role } from "@/lib/generated/prisma/enums"

type RegisterPayload = {
  name: string
  email: string
  phone: string
  password: string
  propertyName: string
  slug: string
}

function validate(body: unknown): body is RegisterPayload {
  if (!body || typeof body !== "object") return false
  const b = body as Record<string, unknown>
  return (
    typeof b.name === "string" && b.name.trim().length >= 2 &&
    typeof b.email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email) &&
    typeof b.phone === "string" && b.phone.replace(/\D/g, "").length >= 10 &&
    typeof b.password === "string" && b.password.length >= 8 &&
    typeof b.propertyName === "string" && b.propertyName.trim().length >= 3 &&
    typeof b.slug === "string" && /^[a-z0-9-]{3,40}$/.test(b.slug)
  )
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!validate(body)) {
      return NextResponse.json(
        apiError("Некоректні дані для реєстрації"),
        { status: 422 }
      )
    }

    const { name, email, phone, password, propertyName, slug } = body

    // Перевіряємо унікальність email
    const existingEmail = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    })
    if (existingEmail) {
      return NextResponse.json(
        apiError("Цей email вже зареєстрований"),
        { status: 409 }
      )
    }

    // Перевіряємо унікальність телефону
    const existingPhone = await prisma.user.findUnique({
      where: { phone },
      select: { id: true },
    })
    if (existingPhone) {
      return NextResponse.json(
        apiError("Цей номер телефону вже зареєстрований"),
        { status: 409 }
      )
    }

    // Перевіряємо унікальність slug
    const existingSlug = await prisma.property.findUnique({
      where: { slug },
      select: { id: true },
    })
    if (existingSlug) {
      return NextResponse.json(
        apiError("Цей slug вже зайнятий, спробуйте інший"),
        { status: 409 }
      )
    }

    // Хешуємо пароль (bcrypt, 12 rounds)
    const passwordHash = await bcrypt.hash(password, 12)

    // Транзакція: створюємо User + Property разом
    const { user, property } = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: name.trim(),
          email,
          phone,
          role: Role.HOST,
          passwordHash,
        },
      })

      const property = await tx.property.create({
        data: {
          slug,
          name: propertyName.trim(),
          hostId: user.id,
          isActive: false, // стає active після підписки або верифікації
        },
      })

      return { user, property }
    })

    return NextResponse.json(
      apiSuccess({
        userId: user.id,
        propertyId: property.id,
        slug: property.slug,
      }),
      { status: 201 }
    )
  } catch (error) {
    console.error("[POST /api/auth/register]", error)
    return NextResponse.json(apiError("Помилка сервера"), { status: 500 })
  }
}
