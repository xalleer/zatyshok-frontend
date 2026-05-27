import type { Metadata } from "next"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { QueryProvider } from "@/components/providers/QueryProvider"
import { fontDisplay, fontBody } from "@/lib/fonts"

export const metadata: Metadata = {
  title: {
    default: "Затишок — Бронювання баз відпочинку",
    template: "%s | Затишок",
  },
  description:
    "Знайдіть ідеальне місце для відпочинку. Глемпінги, будиночки, альтанки по всій Україні.",
  keywords: ["відпочинок", "глемпінг", "база відпочинку", "оренда будиночка", "Україна"],
}

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="uk"
      className={`${fontDisplay.variable} ${fontBody.variable}`}
    >
    <body>
    <QueryProvider>{children}</QueryProvider>
    <Toaster richColors closeButton />
    </body>
    </html>
  )
}
