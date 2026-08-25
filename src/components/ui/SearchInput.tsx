type Props = {
  value: string
  onChange: (value: string) => void
  placeholder: string
}

export function SearchInput({ value, onChange, placeholder }: Props) {
  return (
    <div className="relative">
      <span aria-hidden className="absolute top-1/2 left-3.5 -translate-y-1/2 text-ink-3">
        🔍
      </span>
      <input
        type="search"
        inputMode="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-11 w-full rounded-[var(--radius-pill)] border border-line-strong bg-surface pr-4 pl-10 text-[0.95rem] placeholder:text-ink-3"
      />
    </div>
  )
}
