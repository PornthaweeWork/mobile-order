import { version as reactVersion } from 'react'
import type { ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { env } from '@/lib/env'
import { formatPrice } from '@/lib/money'
import type { MenuItemTag } from '@/types/domain'

const TAG_LABEL: Record<MenuItemTag, string> = {
  new: 'ใหม่',
  recommended: 'แนะนำ',
  bestseller: 'ขายดี',
}

const TOKEN_SWATCHES = [
  { name: 'brand-500', className: 'bg-brand-500' },
  { name: 'brand-600', className: 'bg-brand-600' },
  { name: 'brand-100', className: 'bg-brand-100' },
  { name: 'surface', className: 'bg-surface' },
  { name: 'surface-2', className: 'bg-surface-2' },
  { name: 'warning', className: 'bg-warning' },
  { name: 'danger', className: 'bg-danger' },
  { name: 'ink', className: 'bg-ink' },
]

export function FoundationCheckPage() {
  const storeQuery = useQuery({ queryKey: ['store', 'demo'], queryFn: () => api.getStore('demo') })
  const menuQuery = useQuery({ queryKey: ['menu', 'demo'], queryFn: () => api.getMenu('demo') })

  return (
    <div className="min-h-dvh bg-paper pb-28">
      <header className="pt-safe bg-brand-500 px-5 pt-6 pb-7 text-white">
        <p className="font-mono text-xs tracking-widest text-brand-100 uppercase">EP-0</p>
        <h1 className="mt-1 text-2xl font-semibold">Foundation check</h1>
        <p className="mt-1 text-sm text-brand-100">
          หน้านี้มีไว้ยืนยันว่า build, styling, routing และ mock API ทำงานครบก่อนเริ่ม EP-1
        </p>
      </header>

      <main className="mx-auto flex max-w-2xl flex-col gap-6 px-5 py-6">
        <Section title="สภาพแวดล้อม" subtitle="ค่าที่โหลดเข้ามาจริงตอน runtime">
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-card border border-line bg-line">
            <Fact label="React" value={reactVersion} />
            <Fact label="Mock API (MSW)" value={env.useMock ? 'เปิดอยู่' : 'ปิด'} />
            <Fact label="VITE_API_URL" value={env.apiUrl || '— ยังไม่ตั้ง'} />
            <Fact label="VITE_LIFF_ID" value={env.liffId || '— ยังไม่ตั้ง'} />
          </dl>
        </Section>

        <Section title="Mock API" subtitle="ยิงผ่าน TanStack Query → MSW service worker → fixture">
          {storeQuery.isPending ? (
            <SkeletonCard />
          ) : storeQuery.isError ? (
            <ErrorCard message="โหลดข้อมูลร้านไม่สำเร็จ" />
          ) : (
            <div className="rounded-card border border-line bg-surface p-4 shadow-[var(--shadow-card)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold">{storeQuery.data.name}</h3>
                  <p className="text-sm text-ink-3">
                    VAT {storeQuery.data.vatRate * 100}% · Service charge{' '}
                    {storeQuery.data.serviceChargeRate * 100}%
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-700">
                  {storeQuery.data.isOpen ? 'เปิดอยู่' : 'ปิดแล้ว'}
                </span>
              </div>
              {storeQuery.data.announcement && (
                <p className="mt-3 rounded-lg bg-surface-2 px-3 py-2 text-sm text-ink-2">
                  {storeQuery.data.announcement}
                </p>
              )}
            </div>
          )}
        </Section>

        <Section
          title="ตัวอย่างการ์ดเมนู"
          subtitle="ยังไม่ใช่ UI จริงของ EP-3 — ใช้เช็คการแสดงผลเท่านั้น"
        >
          {menuQuery.isPending ? (
            <div className="flex flex-col gap-3">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : menuQuery.isError ? (
            <ErrorCard message="โหลดเมนูไม่สำเร็จ" />
          ) : (
            <ul className="flex flex-col gap-3">
              {menuQuery.data.items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start gap-3 rounded-card border border-line bg-surface p-4 shadow-[var(--shadow-card)]"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-medium">{item.name}</h3>
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded bg-brand-100 px-2 py-0.5 text-xs text-brand-700"
                        >
                          {TAG_LABEL[tag]}
                        </span>
                      ))}
                      {item.isSoldOut && (
                        <span className="rounded bg-surface-2 px-2 py-0.5 text-xs text-ink-3">
                          หมดแล้ว
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="mt-1 line-clamp-2 text-sm text-ink-3">{item.description}</p>
                    )}
                    <p className="mt-2 font-mono text-sm tabular-nums">
                      {formatPrice(item.basePrice)}
                      {item.optionGroups.length > 0 && (
                        <span className="ml-2 text-ink-3">
                          · {item.optionGroups.length} ตัวเลือก
                        </span>
                      )}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title="Design tokens" subtitle="ทุกสีอ่านจาก CSS variable ใน tokens.css">
          <div className="grid grid-cols-4 gap-2">
            {TOKEN_SWATCHES.map((swatch) => (
              <div key={swatch.name} className="flex flex-col gap-1">
                <div className={`h-12 rounded-lg border border-line ${swatch.className}`} />
                <span className="font-mono text-[10px] text-ink-3">{swatch.name}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Typography" subtitle="IBM Plex Sans Thai — เช็คว่าฟอนต์ไทยโหลดจริง">
          <div className="rounded-card border border-line bg-surface p-4">
            <p className="text-2xl font-semibold">ชาไทยไข่มุกบราวน์ชูการ์</p>
            <p className="text-base">ชาไทยแท้ชงสด ราดบราวน์ชูการ์ ไข่มุกเคี้ยวหนึบ</p>
            <p className="text-sm text-ink-2">หวานน้อย 25% · เพิ่มไข่มุก · แก้วใหญ่</p>
            <p className="font-mono text-sm tabular-nums text-ink-3">฿65.00 · 1,234 ออเดอร์</p>
          </div>
        </Section>
      </main>

      {/* sticky bar — ใช้เช็คว่า safe-area ของ iPhone ทำงานตอนเปิดใน LINE */}
      <div className="pb-safe fixed inset-x-0 bottom-0 border-t border-line bg-surface px-5 pt-3">
        <button
          type="button"
          className="min-h-[var(--tap-min)] w-full rounded-xl bg-brand-500 font-medium text-white transition-colors active:bg-brand-600"
        >
          ปุ่มตัวอย่าง — เช็ค safe area และ touch target
        </button>
      </div>
    </div>
  )
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: ReactNode
}) {
  return (
    <section>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mb-3 text-sm text-ink-3">{subtitle}</p>
      {children}
    </section>
  )
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface px-3 py-2">
      <dt className="text-xs text-ink-3">{label}</dt>
      <dd className="truncate font-mono text-sm">{value}</dd>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-card border border-line bg-surface p-4">
      <div className="h-4 w-1/2 rounded bg-surface-2" />
      <div className="mt-2 h-3 w-3/4 rounded bg-surface-2" />
    </div>
  )
}

function ErrorCard({ message }: { message: string }) {
  return (
    <div className="rounded-card border border-danger/30 bg-danger/5 p-4 text-sm text-danger">
      {message}
    </div>
  )
}
