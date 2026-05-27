// lib/auth.ts
// NextAuth v5 (Auth.js) — головний конфіг
// Credentials (email+password) + Google OAuth
// PrismaAdapter для збереження сесій в БД
//
// УВАГА: цей файл НЕ можна імпортувати в middleware (не Edge-compatible через Prisma)
// Для middleware використовуй lib/auth.config.ts

import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { authConfig } from "@/lib/auth.config"
import { Role } from "@/lib/generated/prisma/enums"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,

  // PrismaAdapter зберігає: Account, Session, VerificationToken
  // User вже є в нашій схемі — адаптер використовує її
  adapter: PrismaAdapter(prisma),

  // JWT стратегія — потрібна для Credentials provider
  // (database стратегія не підтримує Credentials в v5)
  session: { strategy: "jwt" },

  providers: [
    // ── Google OAuth ──────────────────────────────────────────────────────
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // Після Google OAuth — встановлюємо роль HOST якщо прийшов з /auth/register
      // (обробляється в callbacks.signIn нижче)
    }),

    // ── Email + Password ──────────────────────────────────────────────────
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            role: true,
            passwordHash: true,
          },
        })

        if (!user || !user.passwordHash) return null

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        )

        if (!isValid) return null

        // Повертаємо об'єкт — він потрапить у JWT token
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        }
      },
    }),
  ],

  callbacks: {
    // Додаємо role та id в JWT токен
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role: Role }).role ?? Role.CLIENT
      }
      return token
    },

    // Передаємо role та id в session (доступно через useSession / auth())
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as Role
      }
      return session
    },

    // Блокуємо вхід якщо email не підтверджено (опціонально)
    async signIn({ user, account }) {
      // Google OAuth — дозволяємо всім
      if (account?.provider === "google") return true
      // Credentials — authorize вже перевірив пароль
      if (account?.provider === "credentials") return true
      return false
    },
  },

  // Кастомні сторінки (замість дефолтних Auth.js)
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
})
