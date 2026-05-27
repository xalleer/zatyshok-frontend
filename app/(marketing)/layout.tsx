// app/(marketing)/layout.tsx
// Layout для публічних сторінок: /, /p/[slug]
// НЕ застосовується до /dashboard та /auth (вони мають власні layouts)

import { Header } from "@/components/layout/Header"

export default function MarketingLayout({
                                          children,
                                        }: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
