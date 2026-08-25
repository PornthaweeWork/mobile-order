import { BottomSheet } from '@/components/ui/BottomSheet'
import type { ServiceType } from '@/types/domain'

const OPTIONS: Record<ServiceType, { label: string; hint: string; icon: string }> = {
  dine_in: { label: 'ทานที่ร้าน', hint: 'สั่งแล้วรับที่โต๊ะ', icon: '🍽️' },
  pickup: { label: 'รับเอง', hint: 'สั่งล่วงหน้า มารับที่ร้าน', icon: '🛍️' },
  delivery: { label: 'เดลิเวอรี่', hint: 'ส่งถึงที่', icon: '🛵' },
}

type Props = {
  open: boolean
  available: ServiceType[]
  selected: ServiceType | undefined
  /** ยังไม่เคยเลือก = ปิด sheet เองไม่ได้ ต้องเลือกก่อน */
  onClose?: () => void
  onSelect: (type: ServiceType) => void
}

export function ServiceTypePicker({ open, available, selected, onClose, onSelect }: Props) {
  return (
    <BottomSheet open={open} title="รับสินค้าแบบไหนดี" {...(onClose ? { onClose } : {})}>
      <ul className="flex flex-col gap-2 pb-2">
        {available.map((type) => {
          const option = OPTIONS[type]
          const active = type === selected
          return (
            <li key={type}>
              <button
                type="button"
                onClick={() => onSelect(type)}
                aria-pressed={active}
                className={`flex min-h-[var(--tap-min)] w-full items-center gap-3 rounded-[var(--radius-md)] border px-4 py-3 text-left transition-colors ${
                  active
                    ? 'border-flame-600 bg-flame-100'
                    : 'border-line-strong bg-surface active:bg-surface-2'
                }`}
              >
                <span aria-hidden className="text-xl">
                  {option.icon}
                </span>
                <span className="flex-1">
                  <span className="block font-display font-semibold">{option.label}</span>
                  <span className="block text-xs text-ink-3">{option.hint}</span>
                </span>
                {active && <span className="text-flame-600">✓</span>}
              </button>
            </li>
          )
        })}
      </ul>
    </BottomSheet>
  )
}
