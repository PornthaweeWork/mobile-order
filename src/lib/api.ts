import type { Menu, Store } from '@/types/domain'

const BASE_URL = import.meta.env.VITE_API_URL ?? ''

class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  })

  if (!res.ok) {
    throw new ApiError(`คำขอไม่สำเร็จ (${res.status})`, res.status)
  }

  return (await res.json()) as T
}

export const api = {
  getStore: (slug: string) => request<Store>(`/api/stores/${slug}`),
  getMenu: (slug: string) => request<Menu>(`/api/stores/${slug}/menu`),
}

export { ApiError }
