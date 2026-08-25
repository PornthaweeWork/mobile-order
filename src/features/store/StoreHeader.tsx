import { BrandMark } from '@/components/ui/BrandMark'
import { Tag } from '@/components/ui/Tag'
import { isOpenAt, nextOpeningLabel, todayHoursLabel } from '@/lib/hours'
import type { ServiceType, Store } from '@/types/domain'

const SERVICE_LABEL: Record<ServiceType, string> = {
  dine_in: 'ทานที่ร้าน',
  pickup: 'รับเอง',
  delivery: 'เดลิเวอรี่',
}

type Props = {
  store: Store
  now: Date
  serviceType: ServiceType | undefined
  tableNo: string | undefined
  onChangeServiceType: () => void
}

export function StoreHeader({ store, now, serviceType, tableNo, onChangeServiceType }: Props) {
  const open = isOpenAt(store, now)
  const nextOpening = nextOpeningLabel(store, now)

  return (
    <header className="bg-brand-pattern pt-safe">
      <div className="container-page pt-6 pb-6 md:pt-9 md:pb-8">
        <div className="flex items-center gap-3">
          {store.logoUrl ? (
            <img src={store.logoUrl} alt="" width={56} height={56} className="size-11 md:size-14" />
          ) : (
            <BrandMark size={56} className="size-11 md:size-14" />
          )}
          <div className="min-w-0">
            <h1 className="truncate font-display text-xl leading-tight font-extrabold text-ink-inverse md:text-3xl">
              {store.name}
            </h1>
            <p className="text-xs text-ink-inverse-2 md:text-sm">{todayHoursLabel(store, now)}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {open ? (
            <Tag tone="success">เปิดรับออเดอร์</Tag>
          ) : (
            <Tag tone="muted">{nextOpening ?? 'ปิดอยู่'}</Tag>
          )}

          <button
            type="button"
            onClick={onChangeServiceType}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-[var(--radius-pill)] bg-white/12 px-3 text-xs font-semibold text-ink-inverse"
          >
            {tableNo !== undefined
              ? `โต๊ะ ${tableNo}`
              : serviceType
                ? SERVICE_LABEL[serviceType]
                : 'เลือกรูปแบบรับสินค้า'}
            {tableNo === undefined && <span aria-hidden>▾</span>}
          </button>
        </div>

        {store.announcement && (
          <p className="mt-4 max-w-prose rounded-[var(--radius-sm)] bg-white/10 px-3 py-2 text-sm text-ink-inverse md:text-base">
            {store.announcement}
          </p>
        )}

        {!open && (
          <p className="mt-3 text-sm text-ink-inverse-2">
            ตอนนี้ร้านปิดอยู่ ดูเมนูล่วงหน้าได้ แต่ยังสั่งไม่ได้
          </p>
        )}
      </div>
    </header>
  )
}
