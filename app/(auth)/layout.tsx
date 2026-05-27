// app/(auth)/layout.tsx
// Layout для /auth/login та /auth/register
// Десктоп: 50% фото лісу / 50% форма
// Мобільний: чистий фон, тільки форма

import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Вхід | Затишок",
}

export default function AuthLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex">

      {/* ── Ліва половина: фото (тільки десктоп) ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[var(--forest)]">
        {/* Фонове зображення через CSS — замінити на реальне фото з Cloudinary */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=1200&q=80')`,
          }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--forest)]/80 via-[var(--forest)]/20 to-transparent" />

        {/* Контент поверх фото */}
        <div className="relative z-10 flex flex-col justify-between p-10 w-full">
          {/* Логотип */}
          <Link href="/" className="flex items-center gap-2 text-white">
            <span className="text-2xl">🌿</span>
            <span className="font-heading font-semibold text-xl">Затишок</span>
          </Link>

          {/* Цитата знизу */}
          <div className="text-white/90">
            <blockquote className="font-heading text-2xl font-light leading-relaxed italic">
              "Місце, де тиша<br />звучить голосніше<br />за слова"
            </blockquote>
            <p className="mt-4 text-sm text-white/60">
              Більше 200 баз відпочинку по всій Україні
            </p>
          </div>
        </div>
      </div>

      {/* ── Права половина: форма ── */}
      <div className="flex-1 flex flex-col min-h-screen bg-background">
        {/* Мобільний логотип */}
        <div className="lg:hidden px-6 pt-6">
          <Link href="/" className="flex items-center gap-2 text-foreground">
            <span className="text-xl">🌿</span>
            <span className="font-heading font-semibold text-lg">Затишок</span>
          </Link>
        </div>

        {/* Форма — вертикально відцентрована */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm">
            {children}
          </div>
        </div>

        {/* Футер */}
        <div className="px-6 pb-6 text-center">
          <p className="text-xs text-muted-foreground">
            © 2025 Затишок. Всі права захищені.
          </p>
        </div>
      </div>

    </div>
  )
}
