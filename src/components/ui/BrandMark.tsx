type Props = {
  /** cream ใช้บนพื้นเข้ม · brown ใช้บนพื้นสว่าง */
  tone?: 'cream' | 'brown'
  size?: number
  className?: string
}

/** โลโก้มาร์คโอกะหมู — ตัว O ที่มีหูหมู (จาก Okamoo/LOGO) */
export function BrandMark({ tone = 'cream', size = 40, className = '' }: Props) {
  return (
    <img
      src={`/brand/okamoo-mark-${tone}.png`}
      width={size}
      height={size}
      alt="โอกะหมู"
      className={className}
      style={{ width: size, height: size }}
    />
  )
}
