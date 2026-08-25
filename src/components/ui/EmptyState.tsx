import type { ReactNode } from 'react'
import { BrandMark } from './BrandMark'

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-[var(--radius-md)] border border-dashed border-line-strong bg-surface px-6 py-10 text-center">
      <BrandMark tone="brown" size={40} className="opacity-30" />
      <p className="font-display text-base font-bold">{title}</p>
      <p className="max-w-[30ch] text-sm text-ink-3">{description}</p>
      {action}
    </div>
  )
}
