// lib/auth.config.ts
// Конфіг для Edge middleware — БЕЗ Prisma, БЕЗ Node.js API
// Імпортується в middleware.ts та lib/auth.ts
//
// В v5 рекомендований патерн: розділити конфіг на два файли
// щоб middleware залишався Edge-compatible

import type { NextAuthConfig } from "next-auth"
import { Role } from "@/lib/generated/prisma/enums"

export const authConfig: NextAuthConfig = {
  providers: [],
  // providers тут пусті — реальні провайдери в lib/auth.ts
  // middleware використовує тільки callbacks.authorized

  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isHost = (auth?.user as { role?: Role })?.role === Role.HOST ||
        (auth?.user as { role?: Role })?.role === Role.ADMIN

      const isDashboard = nextUrl.pathname.startsWith("/dashboard")
      const isAuthPage = nextUrl.pathname.startsWith("/auth")

      // Захист dashboard — тільки для HOST та ADMIN
      if (isDashboard) {
        if (!isLoggedIn) {
          return Response.redirect(new URL("/auth/login?callbackUrl=/dashboard", nextUrl))
        }
        if (!isHost) {
          // Клієнт потрапив на dashboard — редирект на головну
          return Response.redirect(new URL("/", nextUrl))
        }
        return true
      }

      // Auth сторінки — якщо вже залогінений, редирект
      if (isAuthPage && isLoggedIn) {
        const callbackUrl = nextUrl.searchParams.get("callbackUrl")
        return Response.redirect(new URL(callbackUrl ?? "/dashboard", nextUrl))
      }

      return true
    },
  },

  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
}
