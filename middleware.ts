// middleware.ts  (корінь проекту, поряд з package.json)
// Edge middleware — захищає /dashboard, редиректить auth сторінки
// Використовує auth.config.ts (БЕЗ Prisma) для Edge-сумісності

import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth.config"

// Ініціалізуємо auth тільки з config (без adapter/providers)
// це дозволяє запускатись на Edge Runtime
const { auth } = NextAuth(authConfig)

export default auth

export const config = {
  // Matcher — які шляхи перевіряє middleware
  // Виключаємо статику, API (крім захищених) та _next
  matcher: [
    "/dashboard/:path*",
    "/auth/:path*",
  ],
}
