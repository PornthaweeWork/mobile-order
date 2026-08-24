import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'brand' | 'outline' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
  block?: boolean
  children: ReactNode
}

/**
 * primary = ส้มไฟ ใช้กับ action ที่อยากให้กด (เพิ่มลงตะกร้า, สั่งเลย)
 * brand   = น้ำตาลหมูย่าง ใช้กับ action รองที่ยังเป็นเรื่องหลัก
 * outline / ghost = action เบา
 */
const VARIANT: Record<Variant, string> = {
  primary:
    'bg-flame-600 text-white shadow-[var(--shadow-cta)] active:bg-flame-700 disabled:bg-flame-200 disabled:text-flame-700',
  brand: 'bg-brand-700 text-ink-inverse active:bg-brand-800 disabled:bg-brand-300',
  outline: 'border border-line-strong bg-surface text-ink active:bg-surface-2',
  ghost: 'text-brand-700 active:bg-brand-50',
}

const SIZE: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-sm rounded-[var(--radius-sm)]',
  md: 'h-11 px-5 text-[0.95rem] rounded-[var(--radius-md)]',
  lg: 'h-[52px] px-6 text-base rounded-[var(--radius-lg)]',
}

export function Button({
  variant = 'primary',
  size = 'md',
  block = false,
  className = '',
  children,
  ...rest
}: Props) {
  return (
    <button
      type="button"
      className={`inline-flex min-h-[var(--tap-min)] items-center justify-center gap-2 font-display font-semibold transition-[background-color,transform] duration-150 active:scale-[0.985] disabled:cursor-not-allowed disabled:shadow-none ${VARIANT[variant]} ${SIZE[size]} ${block ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
