import type { MenuItem } from '@/types/domain'

/** ตัดช่องว่างและทำให้เทียบตัวพิมพ์ใหญ่เล็กไม่ต่างกัน */
function normalize(value: string): string {
  return value.trim().toLowerCase()
}

export function matchesQuery(item: MenuItem, query: string): boolean {
  const q = normalize(query)
  if (q === '') return true
  return normalize(item.name).includes(q) || normalize(item.description ?? '').includes(q)
}

export type Segment = { text: string; hit: boolean }

/**
 * ตัดข้อความออกเป็นช่วง ๆ เพื่อไฮไลต์คำค้น
 * คืนช่วงเดียวที่ hit=false ถ้าไม่มีคำค้นหรือหาไม่เจอ
 */
export function highlight(text: string, query: string): Segment[] {
  const q = normalize(query)
  if (q === '') return [{ text, hit: false }]

  const segments: Segment[] = []
  const haystack = text.toLowerCase()
  let cursor = 0

  for (;;) {
    const index = haystack.indexOf(q, cursor)
    if (index === -1) break
    if (index > cursor) segments.push({ text: text.slice(cursor, index), hit: false })
    segments.push({ text: text.slice(index, index + q.length), hit: true })
    cursor = index + q.length
  }

  if (segments.length === 0) return [{ text, hit: false }]
  if (cursor < text.length) segments.push({ text: text.slice(cursor), hit: false })
  return segments
}
