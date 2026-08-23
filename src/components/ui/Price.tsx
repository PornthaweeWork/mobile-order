import { formatPrice } from '@/lib/money'

/** ราคาเป็นองค์ประกอบที่ต้องเด่น — ใช้ฟอนต์ display + สีส้มไฟ */
export function Price({ satang, strikeFrom }: { satang: number; strikeFrom?: number }) {
  return (
    <span className="inline-flex items-baseline gap-2">
      <span className="font-display text-lg font-bold tabular-nums text-flame-600">
        {formatPrice(satang)}
      </span>
      {strikeFrom !== undefined && (
        <span className="text-sm tabular-nums text-ink-3 line-through">
          {formatPrice(strikeFrom)}
        </span>
      )}
    </span>
  )
}
