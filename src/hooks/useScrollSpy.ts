import { useEffect, useState } from 'react'

/** ถือว่าเลื่อนถึงล่างสุดแล้ว เผื่อไว้กันการปัดเศษของแต่ละเบราว์เซอร์ */
const BOTTOM_SLACK_PX = 2

/**
 * บอกว่าตอนนี้เลื่อนอยู่ที่ section ไหน
 *
 * ใช้ IntersectionObserver โดยหด viewport ด้านบนลงมาเท่าความสูงของแถบ tab
 * ที่ค้างอยู่ เพื่อไม่ให้ section ที่อยู่ใต้แถบถูกนับว่ากำลังมองอยู่
 */
export function useScrollSpy(ids: string[], topOffsetPx: number): string | undefined {
  const [activeId, setActiveId] = useState<string | undefined>(ids[0])

  useEffect(() => {
    if (ids.length === 0) return

    const lastId = ids[ids.length - 1]
    const atBottom = () =>
      window.innerHeight + window.scrollY >= document.body.scrollHeight - BOTTOM_SLACK_PX

    const visible = new Set<string>()

    const pick = () => {
      // หมวดสุดท้ายมักสั้นเกินกว่าจะดันขึ้นไปถึงบนสุดได้ พอเลื่อนสุดหน้าแล้ว
      // ให้ถือว่ากำลังดูหมวดสุดท้าย ไม่งั้น tab จะค้างอยู่หมวดก่อนหน้าตลอด
      if (atBottom() && lastId !== undefined) {
        setActiveId(lastId)
        return
      }
      // เลือกอันที่อยู่บนสุดตามลำดับเมนู ไม่ใช่ตามลำดับที่ observer ยิงมา
      const topMost = ids.find((id) => visible.has(id))
      if (topMost !== undefined) setActiveId(topMost)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id)
          else visible.delete(entry.target.id)
        }
        pick()
      },
      { rootMargin: `-${topOffsetPx}px 0px -55% 0px`, threshold: 0 },
    )

    for (const id of ids) {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    }

    window.addEventListener('scroll', pick, { passive: true })
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', pick)
    }
  }, [ids, topOffsetPx])

  return activeId
}
