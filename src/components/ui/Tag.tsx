import type { ReactNode } from 'react'

type Tone = 'hot' | 'pop' | 'brand' | 'muted' | 'success'

const TONE: Record<Tone, string> = {
  hot: 'bg-flame-100 text-flame-700',
  pop: 'bg-pop-400 text-pop-700',
  brand: 'bg-brand-100 text-brand-700',
  muted: 'bg-surface-2 text-ink-3',
  success: 'bg-success-bg text-success',
}

/** ป้ายเล็กบนการ์ดเมนู — ขายดี / ใหม่ / เผ็ด / หมดแล้ว */
export function Tag({ tone = 'brand', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center rounded-[var(--radius-xs)] px-2 py-0.5 text-xs font-semibold ${TONE[tone]}`}
    >
      {children}
    </span>
  )
}
