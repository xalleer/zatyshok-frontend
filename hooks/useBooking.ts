
"use client"

import { useState, useCallback } from "react"
import { format } from "date-fns"
import { toast } from "sonner"
import type { BookingState, BookingStep, CreateBookingPayload, CreateBookingResponse } from "@/lib/types/booking"
import type { ApiResponse } from "@/lib/types/api"
import { PaymentMethod } from "@/lib/generated/prisma/enums"

const INITIAL_STATE: BookingState = {
  step: "dates",
  unitId: null,
  checkIn: null,
  checkOut: null,
  guestName: "",
  guestPhone: "",
  guestComment: "",
  paymentMethod: null,
  bookingId: null,
  holdExpiresAt: null,
}

export function useBooking(unitId: string) {
  const [state, setState] = useState<BookingState>({
    ...INITIAL_STATE,
    unitId,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)


  const goTo = useCallback((step: BookingStep) => {
    setState((s) => ({ ...s, step }))
  }, [])

  const goBack = useCallback(() => {
    setState((s) => {
      const prev: Record<BookingStep, BookingStep> = {
        dates: "dates",
        details: "dates",
        payment: "details",
        confirm: "payment",
      }
      return { ...s, step: prev[s.step] }
    })
  }, [])


  const setDates = useCallback((checkIn: Date | null, checkOut: Date | null) => {
    setState((s) => ({ ...s, checkIn, checkOut }))
  }, [])

  const setGuestDetails = useCallback(
    (name: string, phone: string, comment: string) => {
      setState((s) => ({ ...s, guestName: name, guestPhone: phone, guestComment: comment }))
    },
    []
  )

  const setPaymentMethod = useCallback((method: PaymentMethod) => {
    setState((s) => ({ ...s, paymentMethod: method }))
  }, [])


  const submit = useCallback(async () => {
    if (!state.checkIn || !state.checkOut || !state.paymentMethod) {
      toast.error("Заповніть всі обов'язкові поля")
      return
    }

    const payload: CreateBookingPayload = {
      unitId,
      checkIn: format(state.checkIn, "yyyy-MM-dd"),
      checkOut: format(state.checkOut, "yyyy-MM-dd"),
      guestName: state.guestName,
      guestPhone: state.guestPhone,
      guestComment: state.guestComment || undefined,
      paymentMethod: state.paymentMethod,
    }

    setIsSubmitting(true)

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const json: ApiResponse<CreateBookingResponse> = await res.json()

      if (!json.ok) {
        toast.error(json.error)
        if (res.status === 409) goTo("dates")
        return
      }

      setState((s) => ({
        ...s,
        bookingId: json.data.bookingId,
        holdExpiresAt: json.data.holdExpiresAt
          ? new Date(json.data.holdExpiresAt)
          : null,
        step: "confirm",
      }))

      if (json.data.paymentUrl) {
        window.location.href = json.data.paymentUrl
      }
    } catch {
      toast.error("Мережева помилка. Спробуйте ще раз.")
    } finally {
      setIsSubmitting(false)
    }
  }, [state, unitId, goTo])


  const reset = useCallback(() => {
    setState({ ...INITIAL_STATE, unitId })
  }, [unitId])


  const getNights = useCallback((): number => {
    if (!state.checkIn || !state.checkOut) return 0
    const diff = state.checkOut.getTime() - state.checkIn.getTime()
    return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)))
  }, [state.checkIn, state.checkOut])

  return {
    state,
    isSubmitting,
    goTo,
    goBack,
    setDates,
    setGuestDetails,
    setPaymentMethod,
    submit,
    reset,
    getNights,
  }
}
