import { useEffect, useRef } from 'react'
import type { Category } from '@/types/domain'

type Props = {
  categories: Category[]
  activeId: string | undefined
  onSelect: (categoryId: string) => void
}

/** แถบหมวดหมู่ที่ค้างอยู่ด้านบน — เลื่อนตามเนื้อหา และกดเพื่อกระโดดได้ */
export function CategoryTabs({ categories, activeId, onSelect }: Props) {
  const listRef = useRef<HTMLDivElement>(null)

  // เลื่อนแถบให้เห็นหมวดที่กำลังดูอยู่เสมอ ตอน scroll spy เปลี่ยนค่า
  useEffect(() => {
    if (activeId === undefined) return
    const tab = listRef.current?.querySelector<HTMLElement>(`[data-tab="${activeId}"]`)
    tab?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
  }, [activeId])

  return (
    <div className="sticky top-0 z-10 border-b border-line bg-paper/95 backdrop-blur">
      <div
        ref={listRef}
        role="tablist"
        aria-label="หมวดหมู่เมนู"
        className="container-page flex gap-2 overflow-x-auto py-2.5"
      >
        {categories.map((category) => {
          const active = category.id === activeId
          return (
            <button
              key={category.id}
              type="button"
              role="tab"
              aria-selected={active}
              data-tab={category.id}
              onClick={() => onSelect(category.id)}
              className={`inline-flex h-9 shrink-0 items-center rounded-[var(--radius-pill)] px-4 text-sm font-semibold whitespace-nowrap transition-colors ${
                active
                  ? 'bg-brand-700 text-ink-inverse'
                  : 'border border-line-strong bg-surface text-ink-2 active:bg-surface-2'
              }`}
            >
              {category.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
