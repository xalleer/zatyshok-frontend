
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">

        {/* Логотип */}
        <Link
          href="/"
          className="flex items-center gap-2 font-heading font-semibold text-lg text-foreground"
        >
          <span className="text-xl">🌿</span>
          <span>Затишок</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">Пошук</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard">Для власників</Link>
          </Button>
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-2">
          {/* На мобільному — тільки кнопка входу */}
          <Button variant="outline" size="sm" asChild>
            <Link href="/auth/login">Увійти</Link>
          </Button>
          {/* На десктопі — додатково реєстрація */}
          <Button size="sm" className="hidden md:inline-flex" asChild>
            <Link href="/auth/register">Розмістити обєкт</Link>
          </Button>
        </div>

      </div>
    </header>
  )
}
