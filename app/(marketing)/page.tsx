// app/(marketing)/page.tsx
// Головна сторінка — агрегатор/маркетплейс
//
// Metadata для SEO виноситься сюди (Server Component)
// HeroSection та MarketplaceGrid — клієнтські компоненти

import type { Metadata } from "next"
import { HeroSection } from "@/components/marketplace/HeroSection"
import { MarketplaceGrid } from "@/components/marketplace/MarketplaceGrid"

export const metadata: Metadata = {
  title: "Затишок — Бронювання баз відпочинку",
  description:
    "Знайдіть ідеальне місце для відпочинку. Глемпінги, будиночки, альтанки по всій Україні. Бронювання онлайн за хвилину.",
}

// Параметри пошуку з URL (наприклад ?city=Карпати)
type SearchParams = {
  city?: string
  region?: string
}

type HomePageProps = {
  searchParams: Promise<SearchParams>
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams

  return (
    <>
      <HeroSection />

      {/* Відступ + сітка карток */}
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-6">
        <MarketplaceGrid initialFilters={params} />
      </div>
    </>
  )
}
