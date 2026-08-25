import type { OpeningHour, Store } from '@/types/domain'

const DAY_LABEL = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'] as const

/** "09:00" -> จำนวนนาทีนับจากเที่ยงคืน */
export function toMinutes(time: string): number {
  const [h = '0', m = '0'] = time.split(':')
  return Number(h) * 60 + Number(m)
}

export function dayLabel(day: OpeningHour['day']): string {
  return DAY_LABEL[day] ?? ''
}

export function hoursForDay(store: Store, day: number): OpeningHour | undefined {
  return store.openingHours.find((h) => h.day === day)
}

/**
 * ร้านเปิดอยู่ไหม ณ เวลาที่ให้มา
 *
 * รองรับช่วงที่ข้ามเที่ยงคืน เช่น 16:00–01:00 โดยถือว่าเป็นของวันที่เริ่มเปิด
 * `store.isOpen` เป็นสวิตช์ที่ร้านกดปิดเองได้ ถ้าปิดไว้ให้ถือว่าปิดเสมอ
 */
export function isOpenAt(store: Store, at: Date): boolean {
  if (!store.isOpen) return false

  const minutes = at.getHours() * 60 + at.getMinutes()
  const today = hoursForDay(store, at.getDay())

  if (today) {
    const open = toMinutes(today.open)
    const close = toMinutes(today.close)
    if (close > open ? minutes >= open && minutes < close : minutes >= open) return true
  }

  // ช่วงที่ลากข้ามคืนมาจากเมื่อวาน เช่น เมื่อวาน 18:00–02:00 แล้วตอนนี้ตี 1
  const yesterday = hoursForDay(store, (at.getDay() + 6) % 7)
  if (yesterday) {
    const open = toMinutes(yesterday.open)
    const close = toMinutes(yesterday.close)
    if (close <= open && minutes < close) return true
  }

  return false
}

/** ข้อความบอกเวลาเปิดของวันนี้ เช่น "วันนี้ 16:00–23:00" */
export function todayHoursLabel(store: Store, at: Date): string {
  const today = hoursForDay(store, at.getDay())
  if (!today) return 'วันนี้ร้านปิด'
  return `วันนี้ ${today.open}–${today.close}`
}

/** รอบเปิดถัดไป ใช้ตอนร้านปิดเพื่อบอกว่ากลับมาอีกทีเมื่อไหร่ */
export function nextOpeningLabel(store: Store, at: Date): string | undefined {
  for (let offset = 0; offset < 7; offset++) {
    const day = (at.getDay() + offset) % 7
    const slot = hoursForDay(store, day)
    if (!slot) continue

    const isLaterToday = offset === 0 && at.getHours() * 60 + at.getMinutes() < toMinutes(slot.open)
    if (isLaterToday) return `เปิดอีกครั้งวันนี้ ${slot.open}`
    if (offset > 0) return `เปิดอีกครั้งวัน${dayLabel(slot.day)} ${slot.open}`
  }
  return undefined
}
