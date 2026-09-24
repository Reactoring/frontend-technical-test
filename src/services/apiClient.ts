import type { ZodType } from 'zod'

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3005'

const TIMEOUT_MS = 8000

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

interface RequestOptions<T> {
  schema: ZodType<T>
  method?: 'GET' | 'POST'
  body?: unknown
}

export async function apiRequest<T>(path: string, { schema, method = 'GET', body }: RequestOptions<T>): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
  } catch {
    // Network failure or timeout
    throw new ApiError('Server unreachable')
  }

  if (!response.ok) {
    throw new ApiError(`Request failed with status ${response.status}`, response.status)
  }

  // The API is not trusted: the response must match the schema
  const result = schema.safeParse(await response.json().catch(() => null))
  if (!result.success) {
    throw new ApiError('Unexpected response from server', response.status)
  }
  return result.data
}
