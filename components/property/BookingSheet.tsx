// components/property/BookingSheet.tsx
// Головний флоу бронювання — Sheet з 4 кроками
// Крок 1: вибір дат (Calendar)
// Крок 2: дані гостя (форма)
// Крок 3: вибір оплати
// Крок 4: підтвердження

"use client"

import { useState, useCallback } from "react"
import { format, differenceInCalendarDays } from "date-fns"
import { uk } from "date-fns/locale"
import type { DateRange } from "react-day-picker"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PriceDisplay } from "@/components/shared/PriceDisplay"
import { useAvailability } from "@/hooks/useAvailability"
import { cn } from "@/lib/utils"
import {
  ArrowLeft,
  CalendarDays,
  User,
  Phone,
  MessageSquare,
  CreditCard,
  Banknote,
  CheckCircle2,
  Loader2,
  Clock,
} from "lucide-react"
import type { PropertyDetail, UnitDetail } from "@/lib/types/property"
import { PaymentMethod } from "@/lib/generated/prisma/enums"
import type { ApiResponse } from "@/lib/types/api"
import type { CreateBookingResponse } from "@/lib/types/booking"

type Step = "dates" | "details" | "payment" | "confirm"

type BookingSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  unit: UnitDetail | null
  units: UnitDetail[]
  property: PropertyDetail
  onSelectUnit: (id: string) => void
}

export function BookingSheet({
                               open,
                               onOpenChange,
                               unit,
                               units,
                               property,
                               onSelectUnit,
                             }: BookingSheetProps) {
  const [step, setStep] = useState<Step>("dates")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [selectedUnit, setSelectedUnit] = useState<UnitDetail | null>(unit)
  const [guestName, setGuestName] = useState("")
  const [guestPhone, setGuestPhone] = useState("")
  const [guestComment, setGuestComment] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingResult, setBookingResult] = useState<CreateBookingResponse | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const activeUnit = selectedUnit ?? unit ?? (units.length === 1 ? units[0] : null)

  // Завантажуємо недоступні дати для обраного юніта
  const { data: availability } = useAvailability(activeUnit?.id ?? null)
  const disabledDates = (availability?.unavailableDates ?? []).map((d) => new Date(d))

  const nights = dateRange?.from && dateRange?.to
    ? differenceInCalendarDays(dateRange.to, dateRange.from)
    : 0

  const totalAmount = activeUnit ? activeUnit.pricePerNight * nights : 0
  const prepaidAmount = paymentMethod === PaymentMethod.ONLINE
    ? Math.round(totalAmount * 0.5)
    : 0

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handleClose = () => {
    onOpenChange(false)
    // Скидаємо стан після анімації закриття
    setTimeout(() => {
      setStep("dates")
      setDateRange(undefined)
      setGuestName("")
      setGuestPhone("")
      setGuestComment("")
      setPaymentMethod(null)
      setBookingResult(null)
      setErrors({})
    }, 300)
  }

  const handleBack = () => {
    const prev: Record<Step, Step> = {
      dates: "dates",
      details: "dates",
      payment: "details",
      confirm: "payment",
    }
    setStep(prev[step])
    setErrors({})
  }

  const handleDatesNext = () => {
    if (!dateRange?.from || !dateRange?.to) {
      setErrors({ dates: "Оберіть дату заїзду та виїзду" })
      return
    }
    if (nights < 1) {
      setErrors({ dates: "Мінімальне бронювання — 1 ніч" })
      return
    }
    if (!activeUnit && units.length > 1) {
      setErrors({ dates: "Оберіть варіант проживання" })
      return
    }
    setErrors({})
    setStep("details")
  }

  const handleDetailsNext = () => {
    const e: Record<string, string> = {}
    if (!guestName.trim() || guestName.trim().length < 2) e.name = "Введіть ім'я (мін. 2 символи)"
    if (!guestPhone.trim() || guestPhone.replace(/\D/g, "").length < 10) e.phone = "Введіть коректний телефон"
    if (Object.keys(e).length > 0) { setErrors(e); return }
    setErrors({})
    setStep("payment")
  }

  const handleSubmit = async () => {
    if (!paymentMethod) {
      setErrors({ payment: "Оберіть спосіб оплати" })
      return
    }
    if (!activeUnit || !dateRange?.from || !dateRange?.to) return

    setIsSubmitting(true)
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          unitId: activeUnit.id,
          checkIn: format(dateRange.from, "yyyy-MM-dd"),
          checkOut: format(dateRange.to, "yyyy-MM-dd"),
          guestName: guestName.trim(),
          guestPhone: guestPhone.trim(),
          guestComment: guestComment.trim() || undefined,
          paymentMethod,
        }),
      })

      const json: ApiResponse<CreateBookingResponse> = await res.json()

      if (!json.ok) {
        setErrors({ submit: json.error })
        if (res.status === 409) setStep("dates")
        return
      }

      setBookingResult(json.data)
      setStep("confirm")

      // Редирект на оплату якщо онлайн
      if (json.data.paymentUrl) {
        window.location.href = json.data.paymentUrl
      }
    } catch {
      setErrors({ submit: "Мережева помилка. Спробуйте ще раз." })
    } finally {
      setIsSubmitting(false)
    }
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  const stepTitle: Record<Step, string> = {
    dates: "Оберіть дати",
    details: "Ваші дані",
    payment: "Спосіб оплати",
    confirm: "Бронювання прийнято!",
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl max-h-[92dvh] overflow-y-auto px-0 pb-0 gap-0">

        {/* Header */}
        <SheetHeader className="px-4 pb-3 border-b border-border">
          <div className="flex items-center gap-3">
            {step !== "dates" && step !== "confirm" && (
              <button
                onClick={handleBack}
                className="size-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
              >
                <ArrowLeft className="size-4" />
              </button>
            )}
            <SheetTitle className="text-base font-heading font-medium">
              {stepTitle[step]}
            </SheetTitle>
          </div>

          {/* Прогрес */}
          {step !== "confirm" && (
            <div className="flex gap-1 mt-2">
              {(["dates", "details", "payment"] as Step[]).map((s, i) => (
                <div
                  key={s}
                  className={cn(
                    "h-1 flex-1 rounded-full transition-all duration-300",
                    ["dates", "details", "payment"].indexOf(step) >= i
                      ? "bg-[var(--forest)]"
                      : "bg-border"
                  )}
                />
              ))}
            </div>
          )}
        </SheetHeader>

        {/* Content */}
        <div className="px-4 py-4 space-y-4">

          {/* ── Крок 1: Дати ── */}
          {step === "dates" && (
            <div className="space-y-4">
              {/* Вибір юніта якщо більше 1 */}
              {units.length > 1 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Варіант проживання</p>
                  <div className="space-y-2">
                    {units.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          setSelectedUnit(u)
                          onSelectUnit(u.id)
                        }}
                        className={cn(
                          "w-full text-left p-3 rounded-xl border transition-all",
                          activeUnit?.id === u.id
                            ? "border-[var(--forest)] bg-[var(--forest)]/5"
                            : "border-border hover:border-[var(--forest)]/40"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{u.name}</span>
                          <PriceDisplay amount={u.pricePerNight} period="night" size="sm" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Календар */}
              <div className="flex justify-center">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  locale={uk}
                  disabled={[
                    { before: new Date() },
                    ...disabledDates,
                  ]}
                  numberOfMonths={1}
                  className="rounded-xl border border-border p-3"
                />
              </div>

              {/* Підрахунок вартості */}
              {dateRange?.from && dateRange?.to && nights > 0 && activeUnit && (
                <div className="rounded-xl bg-muted/50 p-3 space-y-1.5 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>{activeUnit.pricePerNight} ₴ × {nights} {nights === 1 ? "ніч" : nights < 5 ? "ночі" : "ночей"}</span>
                    <span>{totalAmount.toLocaleString("uk-UA")} ₴</span>
                  </div>
                  <div className="flex justify-between font-semibold text-foreground border-t border-border pt-1.5">
                    <span>Разом</span>
                    <span>{totalAmount.toLocaleString("uk-UA")} ₴</span>
                  </div>
                </div>
              )}

              {errors.dates && (
                <p className="text-xs text-destructive">{errors.dates}</p>
              )}

              <Button
                onClick={handleDatesNext}
                disabled={!dateRange?.from || !dateRange?.to}
                className="w-full h-11 bg-[var(--forest)] hover:bg-[var(--forest)]/90 font-medium rounded-xl"
              >
                Далі — вказати дані
              </Button>
            </div>
          )}

          {/* ── Крок 2: Дані гостя ── */}
          {step === "details" && (
            <div className="space-y-4">
              {/* Зведення дат */}
              {dateRange?.from && dateRange?.to && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50 text-sm">
                  <CalendarDays className="size-4 text-[var(--forest)]" />
                  <span>
                    {format(dateRange.from, "d MMM", { locale: uk })} —{" "}
                    {format(dateRange.to, "d MMM", { locale: uk })},{" "}
                    {nights} {nights === 1 ? "ніч" : nights < 5 ? "ночі" : "ночей"}
                  </span>
                </div>
              )}

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium flex items-center gap-1.5">
                    <User className="size-3.5 text-muted-foreground" />
                    Ваше ім'я
                  </label>
                  <Input
                    placeholder="Іван Петренко"
                    value={guestName}
                    onChange={(e) => {
                      setGuestName(e.target.value)
                      if (errors.name) setErrors((p) => ({ ...p, name: "" }))
                    }}
                    aria-invalid={!!errors.name}
                    className="h-11"
                  />
                  {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium flex items-center gap-1.5">
                    <Phone className="size-3.5 text-muted-foreground" />
                    Телефон
                  </label>
                  <Input
                    type="tel"
                    placeholder="+380 50 000 00 00"
                    value={guestPhone}
                    onChange={(e) => {
                      setGuestPhone(e.target.value)
                      if (errors.phone) setErrors((p) => ({ ...p, phone: "" }))
                    }}
                    aria-invalid={!!errors.phone}
                    className="h-11"
                  />
                  {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium flex items-center gap-1.5">
                    <MessageSquare className="size-3.5 text-muted-foreground" />
                    Коментар
                    <span className="text-muted-foreground font-normal">(необов'язково)</span>
                  </label>
                  <textarea
                    placeholder="Побажання, час заїзду..."
                    value={guestComment}
                    onChange={(e) => setGuestComment(e.target.value)}
                    rows={2}
                    className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 resize-none placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <Button
                onClick={handleDetailsNext}
                className="w-full h-11 bg-[var(--forest)] hover:bg-[var(--forest)]/90 font-medium rounded-xl"
              >
                Далі — оплата
              </Button>
            </div>
          )}

          {/* ── Крок 3: Оплата ── */}
          {step === "payment" && (
            <div className="space-y-4">
              {/* Підсумок */}
              <div className="rounded-xl border border-border p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Об'єкт</span>
                  <span className="font-medium">{activeUnit?.name}</span>
                </div>
                {dateRange?.from && dateRange?.to && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Дати</span>
                    <span>
                      {format(dateRange.from, "d MMM", { locale: uk })} —{" "}
                      {format(dateRange.to, "d MMM", { locale: uk })}
                    </span>
                  </div>
                )}
                <div className="flex justify-between border-t border-border pt-2 font-semibold text-base">
                  <span>Сума</span>
                  <span>{totalAmount.toLocaleString("uk-UA")} ₴</span>
                </div>
              </div>

              {/* Вибір методу оплати */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Спосіб оплати</p>

                <PaymentOption
                  icon={<CreditCard className="size-5" />}
                  title="Онлайн карткою"
                  subtitle={`Передоплата ${Math.round(totalAmount * 0.5).toLocaleString("uk-UA")} ₴ (50%), решта при заїзді`}
                  active={paymentMethod === PaymentMethod.ONLINE}
                  onClick={() => setPaymentMethod(PaymentMethod.ONLINE)}
                />

                <PaymentOption
                  icon={<Banknote className="size-5" />}
                  title="Готівкою при заїзді"
                  subtitle="Оплата повної суми на місці"
                  active={paymentMethod === PaymentMethod.CASH}
                  onClick={() => setPaymentMethod(PaymentMethod.CASH)}
                />
              </div>

              {errors.payment && (
                <p className="text-xs text-destructive">{errors.payment}</p>
              )}
              {errors.submit && (
                <p className="text-xs text-destructive">{errors.submit}</p>
              )}

              <Button
                onClick={handleSubmit}
                disabled={!paymentMethod || isSubmitting}
                className="w-full h-11 bg-[var(--forest)] hover:bg-[var(--forest)]/90 font-medium rounded-xl"
              >
                {isSubmitting ? (
                  <><Loader2 className="size-4 animate-spin" /> Оформлення...</>
                ) : paymentMethod === PaymentMethod.ONLINE
                  ? "Перейти до оплати"
                  : "Підтвердити бронювання"}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Натискаючи кнопку, ви підтверджуєте замовлення
              </p>
            </div>
          )}

          {/* ── Крок 4: Підтвердження ── */}
          {step === "confirm" && bookingResult && (
            <div className="space-y-5 py-4 text-center">
              <div className="flex justify-center">
                <div className="size-16 rounded-full bg-[var(--forest)]/10 flex items-center justify-center">
                  <CheckCircle2 className="size-9 text-[var(--forest)]" />
                </div>
              </div>

              <div>
                <h3 className="font-heading text-xl font-semibold text-foreground">
                  Бронювання прийнято!
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Власник отримав сповіщення і зв'яжеться з вами найближчим часом
                </p>
              </div>

              {/* Деталі */}
              <div className="rounded-xl border border-border p-4 text-left space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Номер броні</span>
                  <span className="font-mono text-xs text-foreground">
                    #{bookingResult.bookingId.slice(-8).toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Сума</span>
                  <span className="font-medium">{bookingResult.totalAmount.toLocaleString("uk-UA")} ₴</span>
                </div>
                {bookingResult.prepaidAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Передоплата</span>
                    <span className="font-medium text-[var(--forest)]">
                      {bookingResult.prepaidAmount.toLocaleString("uk-UA")} ₴
                    </span>
                  </div>
                )}
              </div>

              {/* HOLD таймер */}
              {bookingResult.holdExpiresAt && (
                <div className="flex items-center gap-2 justify-center text-xs text-muted-foreground">
                  <Clock className="size-3.5" />
                  <span>Бронь утримується 15 хвилин до підтвердження оплати</span>
                </div>
              )}

              <Button
                onClick={handleClose}
                variant="outline"
                className="w-full h-11 rounded-xl"
              >
                Закрити
              </Button>
            </div>
          )}

        </div>
      </SheetContent>
    </Sheet>
  )
}

// ─── PaymentOption ─────────────────────────────────────────────────────────────

function PaymentOption({
                         icon,
                         title,
                         subtitle,
                         active,
                         onClick,
                       }: {
  icon: React.ReactNode
  title: string
  subtitle: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left p-4 rounded-xl border transition-all",
        active
          ? "border-[var(--forest)] bg-[var(--forest)]/5 ring-1 ring-[var(--forest)]/30"
          : "border-border hover:border-[var(--forest)]/40"
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          "mt-0.5 shrink-0",
          active ? "text-[var(--forest)]" : "text-muted-foreground"
        )}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        </div>
        <div className={cn(
          "ml-auto mt-1 size-4 rounded-full border-2 shrink-0 transition-all",
          active
            ? "border-[var(--forest)] bg-[var(--forest)]"
            : "border-border"
        )} />
      </div>
    </button>
  )
}
