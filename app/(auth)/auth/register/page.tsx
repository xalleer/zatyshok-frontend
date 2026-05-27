// app/(auth)/auth/register/page.tsx — ОНОВЛЕНА ВЕРСІЯ
// Реальний POST /api/auth/register + автологін через signIn()

"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { Eye, EyeOff, Loader2, ArrowLeft, CheckCircle2, Globe, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { ApiResponse } from "@/lib/types/api"

type Step = 1 | 2

type Step1Form = {
  name: string
  email: string
  phone: string
  password: string
}

type Step2Form = {
  propertyName: string
  slug: string
}

type FieldErrors<T> = Partial<Record<keyof T, string>> & { general?: string }

function generateSlug(name: string): string {
  const map: Record<string, string> = {
    а:"a",б:"b",в:"v",г:"h",ґ:"g",д:"d",е:"e",є:"ye",ж:"zh",з:"z",
    и:"y",і:"i",ї:"yi",й:"y",к:"k",л:"l",м:"m",н:"n",о:"o",п:"p",
    р:"r",с:"s",т:"t",у:"u",ф:"f",х:"kh",ц:"ts",ч:"ch",ш:"sh",
    щ:"shch",ь:"",ю:"yu",я:"ya",
  }
  return name.toLowerCase().split("").map((c) => map[c] ?? c).join("")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40)
}

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [slugEdited, setSlugEdited] = useState(false)

  const [step1, setStep1] = useState<Step1Form>({ name: "", email: "", phone: "", password: "" })
  const [step2, setStep2] = useState<Step2Form>({ propertyName: "", slug: "" })
  const [errors1, setErrors1] = useState<FieldErrors<Step1Form>>({})
  const [errors2, setErrors2] = useState<FieldErrors<Step2Form>>({})

  useEffect(() => {
    if (!slugEdited && step2.propertyName) {
      setStep2((prev) => ({ ...prev, slug: generateSlug(step2.propertyName) }))
    }
  }, [step2.propertyName, slugEdited])

  // ─── Step 1 ─────────────────────────────────────────────────────────────

  const handleChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setStep1((prev) => ({ ...prev, [name]: value }))
    if (errors1[name as keyof Step1Form]) setErrors1((p) => ({ ...p, [name]: undefined }))
  }

  const validateStep1 = (): FieldErrors<Step1Form> => {
    const e: FieldErrors<Step1Form> = {}
    if (!step1.name.trim() || step1.name.trim().length < 2) e.name = "Введіть ім'я (мін. 2 символи)"
    if (!step1.email) e.email = "Введіть email"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(step1.email)) e.email = "Некоректний email"
    if (!step1.phone.trim() || step1.phone.replace(/\D/g, "").length < 10) {
      e.phone = "Введіть коректний номер телефону"
    }
    if (!step1.password) e.password = "Введіть пароль"
    else if (step1.password.length < 8) e.password = "Мінімум 8 символів"
    return e
  }

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validateStep1()
    if (Object.keys(errs).length > 0) { setErrors1(errs); return }
    setStep(2)
  }

  // ─── Step 2 ─────────────────────────────────────────────────────────────

  const handleChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === "slug") {
      setSlugEdited(true)
      const formatted = value.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-{2,}/g, "-")
      setStep2((prev) => ({ ...prev, slug: formatted }))
    } else {
      setStep2((prev) => ({ ...prev, [name]: value }))
    }
    if (errors2[name as keyof Step2Form]) setErrors2((p) => ({ ...p, [name]: undefined }))
  }

  const validateStep2 = (): FieldErrors<Step2Form> => {
    const e: FieldErrors<Step2Form> = {}
    if (!step2.propertyName.trim() || step2.propertyName.trim().length < 3) {
      e.propertyName = "Введіть назву (мін. 3 символи)"
    }
    if (!step2.slug || step2.slug.length < 3) e.slug = "Мінімум 3 символи"
    else if (!/^[a-z0-9-]+$/.test(step2.slug)) e.slug = "Лише латинські літери, цифри та дефіс"
    return e
  }

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validateStep2()
    if (Object.keys(errs).length > 0) { setErrors2(errs); return }

    setIsLoading(true)
    try {
      // 1. Реєструємо користувача
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...step1, ...step2 }),
      })

      const json: ApiResponse<{ userId: string; slug: string }> = await res.json()

      if (!json.ok) {
        // Обробляємо конфлікти (409) і валідаційні помилки
        if (res.status === 409) {
          const msg = json.error
          if (msg.includes("email")) setErrors1({ email: msg })
          else if (msg.includes("телефон")) setErrors1({ phone: msg })
          else if (msg.includes("slug")) setErrors2({ slug: msg })
          else setErrors2({ general: msg })
          // Якщо помилка стосується step1 — повертаємось
          if (msg.includes("email") || msg.includes("телефон")) setStep(1)
        } else {
          setErrors2({ general: json.error })
        }
        return
      }

      // 2. Автоматичний вхід після реєстрації
      const signInResult = await signIn("credentials", {
        email: step1.email,
        password: step1.password,
        redirect: false,
      })

      if (signInResult?.error) {
        // Реєстрація пройшла, але логін не вдався — редирект на login
        router.push("/auth/login?registered=1")
      } else {
        // Успіх — одразу в dashboard
        router.push("/dashboard")
        router.refresh()
      }
    } catch {
      setErrors2({ general: "Мережева помилка. Спробуйте ще раз." })
    } finally {
      setIsLoading(false)
    }
  }

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Прогрес */}
      <div className="flex items-center gap-2">
        {[1, 2].map((s) => (
          <div key={s} className={cn(
            "h-1.5 flex-1 rounded-full transition-all duration-500",
            step >= s ? "bg-[var(--forest)]" : "bg-border"
          )} />
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="space-y-1">
            <h1 className="font-heading text-2xl font-semibold">Створіть акаунт</h1>
            <p className="text-sm text-muted-foreground">Крок 1 з 2 — Ваші дані</p>
          </div>

          <form onSubmit={handleStep1Submit} className="space-y-4" noValidate>
            <Field id="name" name="name" label="Ваше ім'я" placeholder="Іван Петренко"
                   value={step1.name} onChange={handleChange1} error={errors1.name} autoComplete="name" />
            <Field id="email" name="email" label="Email" type="email" placeholder="you@example.com"
                   value={step1.email} onChange={handleChange1} error={errors1.email} autoComplete="email" />
            <Field id="phone" name="phone" label="Телефон" type="tel" placeholder="+380 50 000 00 00"
                   value={step1.phone} onChange={handleChange1} error={errors1.phone} autoComplete="tel" />

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium">Пароль</label>
              <div className="relative">
                <Input id="password" name="password"
                       type={showPassword ? "text" : "password"}
                       placeholder="Мінімум 8 символів"
                       value={step1.password} onChange={handleChange1}
                       aria-invalid={!!errors1.password}
                       autoComplete="new-password" className="h-10 pr-10" />
                <button type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        aria-label={showPassword ? "Сховати" : "Показати"}>
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors1.password && <p className="text-xs text-destructive">{errors1.password}</p>}
              {step1.password && <PasswordStrength password={step1.password} />}
            </div>

            <Button type="submit" className="w-full h-10 bg-[var(--forest)] hover:bg-[var(--forest)]/90 font-medium mt-2">
              Далі →
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Вже є акаунт?{" "}
            <Link href="/auth/login" className="font-medium text-[var(--forest)] hover:underline underline-offset-4">
              Увійти
            </Link>
          </p>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="space-y-1">
            <button onClick={() => setStep(1)}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3">
              <ArrowLeft className="size-3.5" /> Назад
            </button>
            <h1 className="font-heading text-2xl font-semibold">Ваш об&apos;єкт</h1>
            <p className="text-sm text-muted-foreground">Крок 2 з 2 — Налаштуйте свою сторінку</p>
          </div>

          <form onSubmit={handleStep2Submit} className="space-y-5" noValidate>
            {errors2.general && (
              <div className="flex gap-2 rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2.5">
                <AlertCircle className="size-4 text-destructive shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{errors2.general}</p>
              </div>
            )}

            <Field id="propertyName" name="propertyName" label="Назва вашого об'єкта"
                   placeholder="Садиба «Верховина»"
                   value={step2.propertyName} onChange={handleChange2} error={errors2.propertyName} />

            {/* Slug з preview */}
            <div className="space-y-1.5">
              <label htmlFor="slug" className="text-sm font-medium">Ваше посилання</label>
              <div className={cn(
                "flex items-center rounded-lg border bg-muted/50 overflow-hidden",
                "focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/20",
                errors2.slug ? "border-destructive" : "border-border",
              )}>
                <span className="pl-3 pr-1 text-muted-foreground text-sm select-none whitespace-nowrap">
                  zatyshok.com/p/
                </span>
                <input id="slug" name="slug" type="text"
                       placeholder="miy-obiekt"
                       value={step2.slug} onChange={handleChange2}
                       className="flex-1 bg-transparent py-2 pr-3 text-sm font-mono outline-none min-w-0"
                       aria-invalid={!!errors2.slug} />
              </div>
              {errors2.slug ? (
                <p className="text-xs text-destructive">{errors2.slug}</p>
              ) : step2.slug ? (
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Globe className="size-3 text-[var(--forest)]" />
                  Ваш сайт буде доступний за цим посиланням
                </p>
              ) : null}
            </div>

            {/* Preview */}
            {step2.propertyName && step2.slug && (
              <div className="rounded-xl border border-border bg-card p-4 space-y-1 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-[var(--forest)]" />
                  <p className="text-xs font-medium text-[var(--forest)]">Попередній перегляд</p>
                </div>
                <p className="font-heading font-medium">{step2.propertyName}</p>
                <p className="text-xs text-muted-foreground font-mono">zatyshok.com/p/{step2.slug}</p>
              </div>
            )}

            <Button type="submit" disabled={isLoading}
                    className="w-full h-10 bg-[var(--forest)] hover:bg-[var(--forest)]/90 font-medium">
              {isLoading ? (
                <><Loader2 className="size-4 animate-spin" /> Створення акаунту...</>
              ) : "Створити акаунт 🌿"}
            </Button>
          </form>

          <p className="text-xs text-center text-muted-foreground px-4">
            Реєструючись, ви погоджуєтесь з{" "}
            <Link href="/terms" className="underline underline-offset-3 hover:text-foreground">умовами використання</Link>
          </p>
        </div>
      )}
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Field({ id, name, label, placeholder, value, onChange, error, type = "text", autoComplete }: {
  id: string; name: string; label: string; placeholder?: string
  value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string; type?: string; autoComplete?: string
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium">{label}</label>
      <Input id={id} name={name} type={type} placeholder={placeholder}
             value={value} onChange={onChange} aria-invalid={!!error}
             autoComplete={autoComplete} className="h-10" />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password) || /[А-ЯЁЇІЄ]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-zА-ЯЁа-яёїіє0-9]/.test(password),
  ]
  const score = checks.filter(Boolean).length
  const colors = ["bg-destructive", "bg-orange-400", "bg-yellow-400", "bg-[var(--forest)]"]
  const labels = ["Дуже слабкий", "Слабкий", "Середній", "Надійний"]
  return (
    <div className="space-y-1.5 pt-0.5">
      <div className="flex gap-1">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className={cn("h-1 flex-1 rounded-full transition-all duration-300",
            i < score ? colors[score - 1] : "bg-border")} />
        ))}
      </div>
      {score > 0 && (
        <p className={cn("text-xs",
          score <= 1 ? "text-destructive" : score === 2 ? "text-orange-500" :
            score === 3 ? "text-yellow-600" : "text-[var(--forest)]")}>
          {labels[score - 1]}
        </p>
      )}
    </div>
  )
}
