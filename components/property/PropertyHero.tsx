// components/property/PropertyHero.tsx
// Hero-секція сторінки об'єкта
// Мобільний: повноекранний swiper на 60vh
// Десктоп: сітка фото (як Airbnb)

"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, Share2, ChevronLeft, ChevronRight, Grid2x2 } from "lucide-react"
import { cn } from "@/lib/utils"

type PropertyHeroProps = {
  photos: string[]
  name: string
  slug: string
}

export function PropertyHero({ photos, name, slug }: PropertyHeroProps) {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAllPhotos, setShowAllPhotos] = useState(false)

  const hasPhotos = photos.length > 0
  const placeholder = "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=1200&q=80"
  const displayPhotos = hasPhotos ? photos : [placeholder]

  const prev = () => setCurrentIndex((i) => (i - 1 + displayPhotos.length) % displayPhotos.length)
  const next = () => setCurrentIndex((i) => (i + 1) % displayPhotos.length)

  const handleShare = async () => {
    const url = `${window.location.origin}/p/${slug}`
    if (navigator.share) {
      await navigator.share({ title: name, url })
    } else {
      await navigator.clipboard.writeText(url)
      // TODO: toast "Посилання скопійовано"
    }
  }

  return (
    <>
      {/* ── Мобільний swiper ── */}
      <div className="relative lg:hidden h-[60vmin] min-h-[280px] max-h-[420px] overflow-hidden bg-muted">
        {/* Фото */}
        <div className="relative w-full h-full">
          <Image
            src={displayPhotos[currentIndex]}
            alt={`${name} — фото ${currentIndex + 1}`}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* Gradient overlay зверху для кнопок */}
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/40 to-transparent" />
          {/* Gradient overlay знизу для індикатора */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent" />
        </div>

        {/* Кнопки навігації */}
        <div className="absolute top-0 inset-x-0 flex items-center justify-between px-4 pt-safe pt-4 z-10">
          <button
            onClick={() => router.back()}
            className="size-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors"
            aria-label="Назад"
          >
            <ArrowLeft className="size-4 text-foreground" />
          </button>
          <button
            onClick={handleShare}
            className="size-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors"
            aria-label="Поділитись"
          >
            <Share2 className="size-4 text-foreground" />
          </button>
        </div>

        {/* Стрілки */}
        {displayPhotos.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 size-8 rounded-full bg-white/80 flex items-center justify-center shadow"
              aria-label="Попереднє фото"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 size-8 rounded-full bg-white/80 flex items-center justify-center shadow"
              aria-label="Наступне фото"
            >
              <ChevronRight className="size-4" />
            </button>
          </>
        )}

        {/* Індикатор */}
        {displayPhotos.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {displayPhotos.slice(0, 8).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={cn(
                  "rounded-full transition-all duration-200",
                  i === currentIndex
                    ? "w-5 h-1.5 bg-white"
                    : "w-1.5 h-1.5 bg-white/60"
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Десктоп: сітка фото ── */}
      <div className="hidden lg:block relative">
        {/* Кнопки */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-sm font-medium shadow-sm hover:bg-white transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            Назад
          </button>
        </div>
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-sm font-medium shadow-sm hover:bg-white transition-colors"
          >
            <Share2 className="size-3.5" />
            Поділитись
          </button>
        </div>

        {/* Сітка фото (1 велике + 4 маленьких) */}
        <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[480px] overflow-hidden rounded-b-2xl">
          {/* Головне фото */}
          <div className="col-span-2 row-span-2 relative overflow-hidden">
            <Image
              src={displayPhotos[0] ?? placeholder}
              alt={name}
              fill
              priority
              sizes="50vw"
              className="object-cover hover:scale-[1.02] transition-transform duration-500"
            />
          </div>

          {/* 4 додаткових фото */}
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="relative overflow-hidden">
              {displayPhotos[i] ? (
                <Image
                  src={displayPhotos[i]}
                  alt={`${name} — фото ${i + 1}`}
                  fill
                  sizes="25vw"
                  className="object-cover hover:scale-[1.03] transition-transform duration-500"
                />
              ) : (
                <div className="absolute inset-0 bg-muted" />
              )}
              {/* Кнопка "всі фото" на останній комірці */}
              {i === 4 && displayPhotos.length > 5 && (
                <button
                  onClick={() => setShowAllPhotos(true)}
                  className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white gap-1 hover:bg-black/50 transition-colors"
                >
                  <Grid2x2 className="size-5" />
                  <span className="text-sm font-medium">+{displayPhotos.length - 5} фото</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
