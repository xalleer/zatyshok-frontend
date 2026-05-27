// components/marketplace/HeroSection.tsx
// Hero для головної сторінки
// Мобільний: компактний заголовок + пошук + кнопка геолокації
// Десктоп: більший заголовок, той самий пошук

"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

export function HeroSection() {
  const router = useRouter()
  const [city, setCity] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!city.trim()) return
    const params = new URLSearchParams({ city: city.trim() })
    router.push(`/?${params.toString()}`)
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[var(--cream)] to-background px-4 py-10 md:py-16">

      {/* Декоративний фон — тонкий паттерн */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(var(--forest) 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative mx-auto max-w-2xl text-center">

        {/* Заголовок */}
        <h1 className="font-heading text-3xl font-semibold leading-tight text-foreground md:text-5xl">
          Знайди своє{" "}
          <em className="not-italic text-gradient">місце спокою</em>
        </h1>

        <p className="mt-3 text-sm text-muted-foreground md:text-base">
          Глемпінги, будиночки, альтанки — по всій Україні
        </p>

        {/* Пошук */}
        <form
          onSubmit={handleSearch}
          className="mt-6 flex gap-2 max-w-md mx-auto"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <Input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Місто або область..."
              className="pl-9 h-10 rounded-full border-border/70 bg-white shadow-sm"
            />
          </div>
          <Button
            type="submit"
            className="h-10 rounded-full px-5 bg-[var(--forest)] hover:bg-[var(--forest)]/90"
          >
            Шукати
          </Button>
        </form>

        {/* Підказка про кількість */}
        <p className="mt-4 text-xs text-muted-foreground">
          або скористайся{" "}
          <span className="font-medium text-[var(--forest)]">«Недалеко від мене»</span>
          {" "}нижче ↓
        </p>

      </div>
    </section>
  )
}
