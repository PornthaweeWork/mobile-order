import { useState } from 'react'
import type { ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import { BrandMark } from '@/components/ui/BrandMark'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { Price } from '@/components/ui/Price'
import { Tag } from '@/components/ui/Tag'
import { api } from '@/lib/api'
import { env } from '@/lib/env'
import { formatRate } from '@/lib/money'
import type { MenuItem, MenuItemTag } from '@/types/domain'

const TAG_LABEL: Record<MenuItemTag, { text: string; tone: 'hot' | 'pop' | 'brand' }> = {
  bestseller: { text: 'ขายดี', tone: 'pop' },
  recommended: { text: 'แนะนำ', tone: 'hot' },
  new: { text: 'ใหม่', tone: 'brand' },
}

const SWATCHES = [
  {
    group: 'Brand · น้ำตาลหมูย่าง',
    note: 'ใช้กับ chrome ของแอป — header, nav, พื้นเข้ม',
    items: [
      { token: 'brand-700', hex: '#722815', label: 'Grilled Pork Brown · PANTONE 1685 C' },
      { token: 'brand-600', hex: '#844526', label: 'Dark Brown · PANTONE 1395 C' },
      { token: 'brand-500', hex: '#A75C2B', label: 'Rust (จากลาย pattern)' },
      { token: 'brand-300', hex: '#E8BD84', label: 'Piglet Cream · PANTONE 3596 C' },
    ],
  },
  {
    group: 'Flame · ส้มไฟ',
    note: 'สีของ "ของร้อน" ใช้กับปุ่มหลักและราคา',
    items: [
      { token: 'flame-500', hex: '#E24305', label: 'Freshy Orange · PANTONE Orange 021 C' },
      { token: 'flame-400', hex: '#FF825C', label: 'Amber Flame · PANTONE 170 C' },
      { token: 'flame-600', hex: '#C23A04', label: 'ระดับที่อ่านออกบนพื้นสว่าง' },
      { token: 'pop-400', hex: '#F9EF7A', label: 'Yellow Pop · PANTONE 106 C' },
    ],
  },
  {
    group: 'Surface & Ink',
    note: 'พื้นครีมอุ่นถอดจาก Piglet Cream · ตัวอักษรใช้ Charcoal Black',
    items: [
      { token: 'paper', hex: '#FDF7EF', label: 'พื้นหลังแอป' },
      { token: 'surface-2', hex: '#F7EBDC', label: 'พื้นรอง / skeleton' },
      { token: 'line', hex: '#EEDFCB', label: 'เส้นคั่น' },
      { token: 'ink', hex: '#473E37', label: 'Charcoal Black · PANTONE 7553 C' },
    ],
  },
]

export function DesignSystemPage() {
  const storeQuery = useQuery({
    queryKey: ['store', 'okamoo'],
    queryFn: () => api.getStore('okamoo'),
  })
  const menuQuery = useQuery({ queryKey: ['menu', 'okamoo'], queryFn: () => api.getMenu('okamoo') })
  const [activeCat, setActiveCat] = useState('cat_signature')

  const categories = menuQuery.data?.categories ?? []
  const featured = (menuQuery.data?.items ?? []).filter((item) => item.categoryId === activeCat)

  return (
    <div className="min-h-dvh bg-paper pb-32">
      {/* ── Hero ────────────────────────────────────────────── */}
      <header className="bg-brand-pattern pt-safe relative overflow-hidden">
        <div className="container-page relative pt-7 pb-9 md:pt-10 md:pb-12">
          <div className="flex items-center gap-3">
            <BrandMark size={46} />
            <div>
              <p className="font-display text-2xl leading-none font-extrabold tracking-tight text-ink-inverse">
                โอกะหมู
              </p>
              <p className="font-mono text-[0.66rem] tracking-[0.32em] text-brand-300 uppercase">
                Okamoo
              </p>
            </div>
          </div>

          <h1 className="mt-6 max-w-[16ch] font-display text-[2rem] leading-[1.15] font-extrabold text-ink-inverse md:text-[2.75rem]">
            หมูกระทะพรีเมียม<span className="text-flame-400"> สั่งจบในไลน์</span>
          </h1>
          <p className="mt-2 max-w-[30ch] text-sm text-ink-inverse-2">
            {storeQuery.data?.announcement ?? 'กำลังโหลดโปรโมชันของร้าน…'}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] bg-white/12 px-3 py-1 text-xs font-semibold text-ink-inverse">
              <span className="size-1.5 rounded-full bg-success" />
              {storeQuery.data?.isOpen ? 'เปิดรับออเดอร์' : 'ปิดอยู่'}
            </span>
            <span className="rounded-[var(--radius-pill)] bg-white/12 px-3 py-1 text-xs text-ink-inverse-2">
              ทานที่ร้าน · รับเอง · เดลิเวอรี่
            </span>
          </div>
        </div>
      </header>

      <main className="container-page flex flex-col gap-9 py-7 md:gap-12 md:py-10">
        {/* ── CI ลงงานจริง: การ์ดเมนู ───────────────────────── */}
        <section>
          <SectionHead
            eyebrow="CI ลงงานจริง"
            title="การ์ดเมนู"
            note="พื้นผิวที่ลูกค้าเห็นบ่อยที่สุด — ชื่อเมนูมาจากเมนูจริงของร้าน ราคายังเป็นตัวเลขสมมติ"
          />

          <div className="-mx-5 mb-4 flex gap-2 overflow-x-auto px-5 pb-1 md:-mx-8 md:px-8">
            {categories.map((cat) => (
              <Chip key={cat.id} active={cat.id === activeCat} onClick={() => setActiveCat(cat.id)}>
                {cat.name}
              </Chip>
            ))}
          </div>

          {menuQuery.isPending ? (
            <div className="flex flex-col gap-3">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : menuQuery.isError ? (
            <ErrorCard message="โหลดเมนูไม่สำเร็จ ลองใหม่อีกครั้ง" />
          ) : (
            <ul className="grid gap-3 md:grid-cols-2">
              {featured.map((item) => (
                <MenuCard key={item.id} item={item} />
              ))}
            </ul>
          )}
        </section>

        {/* ── สี ────────────────────────────────────────────── */}
        <section>
          <SectionHead
            eyebrow="Colour"
            title="พาเลตแบรนด์"
            note="ค่าทั้งหมดอ้างจาก BRAND COLOR.pdf ใน Drive ของโอกะหมู"
          />
          <div className="flex flex-col gap-5">
            {SWATCHES.map((group) => (
              <div key={group.group}>
                <p className="font-display text-sm font-bold">{group.group}</p>
                <p className="mb-2.5 text-xs text-ink-3">{group.note}</p>
                <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
                  {group.items.map((sw) => (
                    <div
                      key={sw.token}
                      className="overflow-hidden rounded-[var(--radius-sm)] border border-line bg-surface"
                    >
                      <div className="h-14" style={{ background: sw.hex }} />
                      <div className="px-2.5 py-2">
                        <p className="font-mono text-[0.68rem] text-ink">{sw.hex}</p>
                        <p className="text-[0.66rem] leading-tight text-ink-3">{sw.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── ตัวพิมพ์ ───────────────────────────────────────── */}
        <section>
          <SectionHead
            eyebrow="Type"
            title="ตัวพิมพ์"
            note="คู่มือกำหนด FC Orbit / Ruddy เป็น primary แต่ยังไม่มี webfont license จึงใช้ชั้น Google Font ที่คู่มือระบุไว้เอง"
          />
          <div className="grid gap-2.5 md:grid-cols-2">
            <TypeRow role="Display · Montserrat + IBM Plex Sans Thai" note="หัวข้อ ชื่อเมนู ราคา">
              <p className="font-display text-2xl font-extrabold">ชุดสามหมูพรีเมียม</p>
            </TypeRow>
            <TypeRow role="Body · IBM Plex Sans Thai" note="คำอธิบาย ตัวเลือก ฟอร์ม">
              <p className="text-base">
                สันคอ สันนอก สามชั้น คัดพิเศษ หมักสูตรร้าน 12 ชั่วโมง เสิร์ฟพร้อมผักสด
              </p>
            </TypeRow>
            <TypeRow role="Mono · IBM Plex Mono" note="รหัสออเดอร์ หมายเลขคิว">
              <p className="font-mono text-base tabular-nums">OKM-20260823-0147 · คิว A12</p>
            </TypeRow>
          </div>
        </section>

        {/* ── คอมโพเนนต์ ─────────────────────────────────────── */}
        <section>
          <SectionHead
            eyebrow="Components"
            title="ปุ่มและป้าย"
            note="ส้มไฟสงวนไว้ให้ action ที่อยากให้กด · น้ำตาลใช้กับ action รอง"
          />
          <div className="flex flex-col gap-3 rounded-[var(--radius-md)] border border-line bg-surface p-4">
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="primary">เพิ่มลงตะกร้า</Button>
              <Button variant="brand">ดูเมนูทั้งหมด</Button>
              <Button variant="outline">แก้ไข</Button>
              <Button variant="ghost">ยกเลิก</Button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm">เล็ก</Button>
              <Button size="md">กลาง</Button>
              <Button size="lg">ใหญ่</Button>
              <Button disabled>สินค้าหมด</Button>
            </div>
            <div className="flex flex-wrap items-center gap-2 border-t border-line pt-3">
              <Tag tone="pop">ขายดี</Tag>
              <Tag tone="hot">แนะนำ</Tag>
              <Tag tone="brand">ใหม่</Tag>
              <Tag tone="success">พร้อมรับ</Tag>
              <Tag tone="muted">หมดแล้ว</Tag>
            </div>
          </div>
        </section>

        {/* ── สถานะระบบ ──────────────────────────────────────── */}
        <section>
          <SectionHead eyebrow="Build" title="สถานะระบบ" note="ค่าที่โหลดเข้ามาจริงตอน runtime" />
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-sm)] border border-line bg-line md:grid-cols-4">
            <Fact label="Mock API (MSW)" value={env.useMock ? 'เปิดอยู่' : 'ปิด'} />
            <Fact
              label="VAT / Service charge"
              value={
                storeQuery.data
                  ? `${formatRate(storeQuery.data.vatRate)} / ${formatRate(storeQuery.data.serviceChargeRate)}`
                  : '—'
              }
            />
            <Fact label="VITE_API_URL" value={env.apiUrl || '— ยังไม่ตั้ง'} />
            <Fact label="VITE_LIFF_ID" value={env.liffId || '— ยังไม่ตั้ง'} />
          </dl>
        </section>
      </main>

      {/* ── Sticky cart bar ─────────────────────────────────── */}
      <div className="pb-safe fixed inset-x-0 bottom-0 border-t border-line bg-surface/95 px-5 pt-3 backdrop-blur">
        <div className="container-page flex items-center gap-3 !px-0">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-ink-3">3 รายการในตะกร้า</p>
            <p className="font-display text-lg font-bold tabular-nums">฿1,247</p>
          </div>
          <Button size="lg" className="shrink-0">
            สั่งเลย
          </Button>
        </div>
      </div>
    </div>
  )
}

/* ── ชิ้นส่วนเฉพาะหน้านี้ ─────────────────────────────────────── */

function MenuCard({ item }: { item: MenuItem }) {
  return (
    <li className="flex gap-3.5 rounded-[var(--radius-md)] border border-line bg-surface p-3 shadow-[var(--shadow-card)]">
      {/* ยังไม่มีรูปถ่ายจริง ใช้ไล่เฉดอุ่น + มาร์คแบรนด์แทนไปก่อน */}
      <div className="bg-sizzle relative grid size-[88px] shrink-0 place-items-center overflow-hidden rounded-[var(--radius-sm)] md:size-28">
        <BrandMark size={44} className="opacity-25" />
        {item.isSoldOut && (
          <div className="absolute inset-0 grid place-items-center bg-brand-950/65">
            <span className="text-xs font-semibold text-ink-inverse">หมดแล้ว</span>
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="font-display text-base leading-tight font-bold">{item.name}</h3>
        {item.tags.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1.5">
            {item.tags.map((tag) => (
              <Tag key={tag} tone={TAG_LABEL[tag].tone}>
                {TAG_LABEL[tag].text}
              </Tag>
            ))}
          </div>
        )}

        {item.description && (
          <p className="mt-0.5 line-clamp-2 text-[0.82rem] leading-snug text-ink-3">
            {item.description}
          </p>
        )}

        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div>
            <Price satang={item.basePrice} />
            {item.optionGroups.length > 0 && (
              <p className="text-[0.7rem] text-ink-3">เลือกได้ {item.optionGroups.length} อย่าง</p>
            )}
          </div>
          <Button size="sm" disabled={item.isSoldOut}>
            {item.isSoldOut ? 'หมด' : 'เพิ่ม'}
          </Button>
        </div>
      </div>
    </li>
  )
}

function SectionHead({ eyebrow, title, note }: { eyebrow: string; title: string; note: string }) {
  return (
    <div className="mb-3.5">
      <p className="font-mono text-[0.66rem] tracking-[0.22em] text-flame-600 uppercase">
        {eyebrow}
      </p>
      <h2 className="font-display text-xl font-bold">{title}</h2>
      <p className="mt-0.5 text-[0.82rem] leading-snug text-ink-3">{note}</p>
    </div>
  )
}

function TypeRow({ role, note, children }: { role: string; note: string; children: ReactNode }) {
  return (
    <div className="rounded-[var(--radius-sm)] border border-line bg-surface p-3.5">
      <div className="mb-1.5 flex flex-wrap items-baseline gap-x-2">
        <p className="font-mono text-[0.66rem] text-ink-3">{role}</p>
        <p className="text-[0.66rem] text-ink-3">· {note}</p>
      </div>
      {children}
    </div>
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
    <div className="flex animate-pulse gap-3.5 rounded-[var(--radius-md)] border border-line bg-surface p-3">
      <div className="size-[88px] shrink-0 rounded-[var(--radius-sm)] bg-surface-2 md:size-28" />
      <div className="flex-1 pt-1">
        <div className="h-4 w-1/2 rounded bg-surface-2" />
        <div className="mt-2 h-3 w-3/4 rounded bg-surface-2" />
      </div>
    </div>
  )
}

function ErrorCard({ message }: { message: string }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-danger/25 bg-danger-bg p-4 text-sm text-danger">
      {message}
    </div>
  )
}
