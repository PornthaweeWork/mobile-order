import { BrandMark } from '@/components/ui/BrandMark'
import { Price } from '@/components/ui/Price'
import { Tag } from '@/components/ui/Tag'
import { highlight } from '@/lib/search'
import type { MenuItem, MenuItemTag } from '@/types/domain'

const TAG_STYLE: Record<MenuItemTag, { text: string; tone: 'hot' | 'pop' | 'brand' }> = {
  bestseller: { text: 'ขายดี', tone: 'pop' },
  recommended: { text: 'แนะนำ', tone: 'hot' },
  new: { text: 'ใหม่', tone: 'brand' },
}

/** ไฮไลต์คำค้นในข้อความ */
function Highlighted({ text, query }: { text: string; query: string }) {
  return (
    <>
      {highlight(text, query).map((segment, index) =>
        segment.hit ? (
          <mark key={index} className="rounded bg-pop-400 px-0.5 text-pop-700">
            {segment.text}
          </mark>
        ) : (
          <span key={index}>{segment.text}</span>
        ),
      )}
    </>
  )
}

export function MenuCard({ item, query = '' }: { item: MenuItem; query?: string }) {
  return (
    <li className="flex gap-3.5 rounded-[var(--radius-md)] border border-line bg-surface p-3 shadow-[var(--shadow-card)] md:gap-4 md:p-3.5">
      <div className="bg-sizzle relative grid size-[88px] shrink-0 place-items-center overflow-hidden rounded-[var(--radius-sm)] md:size-28">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt=""
            loading="lazy"
            decoding="async"
            width={112}
            height={112}
            className="size-full object-cover"
          />
        ) : (
          // ยังไม่มีรูปถ่ายจริง ใช้ไล่เฉดอุ่น + มาร์คแบรนด์ไปก่อน
          <BrandMark size={44} className="opacity-25" />
        )}
        {item.isSoldOut && (
          <div className="absolute inset-0 grid place-items-center bg-brand-950/65">
            <span className="text-xs font-semibold text-ink-inverse">หมดแล้ว</span>
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="font-display text-base leading-tight font-bold md:text-[1.05rem]">
          <Highlighted text={item.name} query={query} />
        </h3>

        {item.tags.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1.5">
            {item.tags.map((tag) => (
              <Tag key={tag} tone={TAG_STYLE[tag].tone}>
                {TAG_STYLE[tag].text}
              </Tag>
            ))}
          </div>
        )}

        {item.description && (
          <p className="mt-1 line-clamp-2 text-[0.82rem] leading-snug text-ink-3">
            <Highlighted text={item.description} query={query} />
          </p>
        )}

        <div className="mt-auto pt-2">
          <Price satang={item.basePrice} />
          {item.optionGroups.length > 0 && (
            <p className="text-[0.7rem] text-ink-3">เลือกได้ {item.optionGroups.length} อย่าง</p>
          )}
        </div>
      </div>
    </li>
  )
}
