
"use client"

import { useState, useCallback } from "react"

type GeolocationState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; lat: number; lng: number }
  | { status: "error"; message: string }


export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({ status: "idle" })

  const request = useCallback(() => {
    if (!navigator.geolocation) {
      setState({
        status: "error",
        message: "Геолокація не підтримується вашим браузером",
      })
      return
    }

    setState({ status: "loading" })

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          status: "success",
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      (error) => {
        const messages: Record<number, string> = {
          1: "Доступ до геолокації заборонено. Дозвольте в налаштуваннях браузера.",
          2: "Не вдалося визначити місцезнаходження.",
          3: "Час очікування вийшов. Спробуйте ще раз.",
        }
        setState({
          status: "error",
          message: messages[error.code] ?? "Помилка геолокації",
        })
      },
      {
        enableHighAccuracy: false,
        timeout: 10_000,
        maximumAge: 5 * 60 * 1000,
      }
    )
  }, [])

  const reset = useCallback(() => {
    setState({ status: "idle" })
  }, [])

  return { state, request, reset }
}
