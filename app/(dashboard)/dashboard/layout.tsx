// app/(dashboard)/dashboard/layout.tsx
// Адмінка — layout з Sidebar (десктоп) та Bottom Nav (мобільний)

import type { Metadata } from "next"
import Link from "next/link"
import { CalendarDays, Settings, LayoutDashboard } from "lucide-react"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Адмінка | Затишок",
}

const NAV_ITEMS = [
  { href: "/dashboard", label: "Бронювання", icon: LayoutDashboard },
  { href: "/dashboard/calendar", label: "Календар", icon: CalendarDays },
  { href: "/dashboard/settings", label: "Налаштування", icon: Settings },
]

export default function DashboardLayout({
                                          children,
                                        }: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background flex">

      {/* ── Sidebar (десктоп) ── */}
      <aside className="hidden lg:flex flex-col w-60 border-r border-border bg-sidebar shrink-0">
        {/* Логотип */}
        <div className="px-6 py-5 border-b border-border">
          <Link href="/" className="flex items-center gap-2 text-foreground">
            <span className="text-xl">🌿</span>
            <span className="font-heading font-semibold text-lg">Затишок</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Посилання на публічну сторінку */}
        <div className="px-3 py-4 border-t border-sidebar-border">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 text-xs text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors"
          >
            ← Повернутись на сайт
          </Link>
        </div>
      </aside>

      {/* ── Основний контент ── */}
      <div className="flex-1 flex flex-col min-h-screen">

        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
          <div className="flex h-14 items-center justify-between px-4">
            <Link href="/" className="flex items-center gap-2 font-heading font-semibold text-base">
              <span>🌿</span>
              <span>Затишок</span>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 py-6 lg:px-8 pb-24 lg:pb-6">
          {children}
        </main>

        {/* ── Bottom Nav (мобільний) ── */}
        <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-background/95 backdrop-blur-md pb-safe">
          <div className="flex items-center justify-around h-14">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center gap-1 px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon className="size-5" />
                <span className="text-[10px] font-medium">{label}</span>
              </Link>
            ))}
          </div>
        </nav>

      </div>
    </div>
  )
}
