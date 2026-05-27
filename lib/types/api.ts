// lib/types/api.ts
// Загальні типи для API відповідей

// ─── Generic API Response ─────────────────────────────────────────────────────

/**
 * Успішна відповідь
 */
export type ApiSuccess<T> = {
  ok: true
  data: T
}

/**
 * Помилкова відповідь
 */
export type ApiError = {
  ok: false
  error: string
  /** Для валідаційних помилок — поле → повідомлення */
  fieldErrors?: Record<string, string>
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError

// ─── Pagination ───────────────────────────────────────────────────────────────

export type PaginatedResponse<T> = ApiSuccess<{
  items: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}>

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function apiSuccess<T>(data: T): ApiSuccess<T> {
  return { ok: true, data }
}

export function apiError(
  error: string,
  fieldErrors?: Record<string, string>
): ApiError {
  return { ok: false, error, fieldErrors }
}
