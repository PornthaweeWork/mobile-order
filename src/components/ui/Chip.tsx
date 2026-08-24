type Props = {
  active?: boolean
  onClick?: () => void
  children: React.ReactNode
}

/** ปุ่มหมวดหมู่แบบเลื่อนแนวนอน (จะถูกใช้จริงใน EP-3) */
export function Chip({ active = false, onClick, children }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex h-9 shrink-0 items-center rounded-[var(--radius-pill)] px-4 text-sm font-semibold whitespace-nowrap transition-colors ${
        active
          ? 'bg-brand-700 text-ink-inverse'
          : 'border border-line-strong bg-surface text-ink-2 active:bg-surface-2'
      }`}
    >
      {children}
    </button>
  )
}
