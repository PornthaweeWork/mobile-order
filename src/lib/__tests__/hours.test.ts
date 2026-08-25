import { describe, expect, it } from 'vitest'
import { isOpenAt, nextOpeningLabel, toMinutes, todayHoursLabel } from '../hours'
import type { Store } from '@/types/domain'

function storeWith(openingHours: Store['openingHours'], isOpen = true): Store {
  return {
    id: 's1',
    slug: 'okamoo',
    name: 'โอกะหมู',
    logoUrl: '',
    coverUrl: '',
    isOpen,
    openingHours,
    serviceTypes: ['dine_in'],
    currency: 'THB',
    vatRate: 0.07,
    serviceChargeRate: 0,
  }
}

/** 2026-08-24 เป็นวันจันทร์ (day = 1) */
const monday = (h: number, m = 0) => new Date(2026, 7, 24, h, m)
const tuesday = (h: number, m = 0) => new Date(2026, 7, 25, h, m)

describe('toMinutes', () => {
  it('แปลงเวลาเป็นนาทีนับจากเที่ยงคืน', () => {
    expect(toMinutes('00:00')).toBe(0)
    expect(toMinutes('09:30')).toBe(570)
    expect(toMinutes('23:59')).toBe(1439)
  })
})

describe('isOpenAt', () => {
  const store = storeWith([{ day: 1, open: '16:00', close: '23:00' }])

  it('เปิดอยู่ในช่วงเวลาทำการ', () => {
    expect(isOpenAt(store, monday(18))).toBe(true)
  })

  it('ปิดก่อนเวลาเปิดและตั้งแต่เวลาปิด', () => {
    expect(isOpenAt(store, monday(15, 59))).toBe(false)
    expect(isOpenAt(store, monday(23))).toBe(false)
  })

  it('ปิดถ้าไม่มีรอบของวันนั้น', () => {
    expect(isOpenAt(store, tuesday(18))).toBe(false)
  })

  it('ร้านกดปิดเองแล้วถือว่าปิด แม้อยู่ในเวลาทำการ', () => {
    expect(isOpenAt(storeWith(store.openingHours, false), monday(18))).toBe(false)
  })

  it('รองรับรอบที่ข้ามเที่ยงคืน', () => {
    const lateNight = storeWith([{ day: 1, open: '18:00', close: '02:00' }])
    expect(isOpenAt(lateNight, monday(20))).toBe(true)
    expect(isOpenAt(lateNight, monday(23, 59))).toBe(true)
    // ตี 1 ของวันอังคาร ยังนับเป็นรอบของคืนวันจันทร์
    expect(isOpenAt(lateNight, tuesday(1))).toBe(true)
    // ตี 3 เลยเวลาปิดแล้ว
    expect(isOpenAt(lateNight, tuesday(3))).toBe(false)
  })
})

describe('todayHoursLabel', () => {
  it('บอกเวลาทำการของวันนี้', () => {
    const store = storeWith([{ day: 1, open: '16:00', close: '23:00' }])
    expect(todayHoursLabel(store, monday(10))).toBe('วันนี้ 16:00–23:00')
  })

  it('บอกว่าวันนี้ร้านปิดถ้าไม่มีรอบ', () => {
    const store = storeWith([{ day: 1, open: '16:00', close: '23:00' }])
    expect(todayHoursLabel(store, tuesday(10))).toBe('วันนี้ร้านปิด')
  })
})

describe('nextOpeningLabel', () => {
  it('บอกรอบถัดไปของวันนี้ถ้ายังไม่ถึงเวลาเปิด', () => {
    const store = storeWith([{ day: 1, open: '16:00', close: '23:00' }])
    expect(nextOpeningLabel(store, monday(10))).toBe('เปิดอีกครั้งวันนี้ 16:00')
  })

  it('ข้ามไปวันถัดไปถ้าวันนี้เลยเวลาเปิดแล้ว', () => {
    const store = storeWith([
      { day: 1, open: '16:00', close: '23:00' },
      { day: 3, open: '11:00', close: '20:00' },
    ])
    expect(nextOpeningLabel(store, monday(23, 30))).toBe('เปิดอีกครั้งวันพุธ 11:00')
  })

  it('คืน undefined ถ้าไม่มีรอบเปิดเลย', () => {
    expect(nextOpeningLabel(storeWith([]), monday(10))).toBeUndefined()
  })
})
