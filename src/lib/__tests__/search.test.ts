import { describe, expect, it } from 'vitest'
import { highlight, matchesQuery } from '../search'
import type { MenuItem } from '@/types/domain'

const item: MenuItem = {
  id: 'i1',
  categoryId: 'c1',
  name: 'ชุดสามหมูพรีเมียม',
  description: 'สันคอ สันนอก สามชั้น',
  basePrice: 45900,
  isSoldOut: false,
  tags: [],
  optionGroups: [],
}

describe('matchesQuery', () => {
  it('คำค้นว่างถือว่าตรงทุกเมนู', () => {
    expect(matchesQuery(item, '')).toBe(true)
    expect(matchesQuery(item, '   ')).toBe(true)
  })

  it('หาจากชื่อเมนูได้', () => {
    expect(matchesQuery(item, 'สามหมู')).toBe(true)
  })

  it('หาจากคำอธิบายได้', () => {
    expect(matchesQuery(item, 'สันนอก')).toBe(true)
  })

  it('ไม่ตรงก็คืน false', () => {
    expect(matchesQuery(item, 'กุ้ง')).toBe(false)
  })

  it('ไม่สนตัวพิมพ์ใหญ่เล็กและช่องว่างหัวท้าย', () => {
    const english: MenuItem = { ...item, name: 'Corn Ribs' }
    expect(matchesQuery(english, '  corn ')).toBe(true)
  })
})

describe('highlight', () => {
  it('คืนช่วงเดียวถ้าไม่มีคำค้น', () => {
    expect(highlight('ยำมาม่า', '')).toEqual([{ text: 'ยำมาม่า', hit: false }])
  })

  it('คืนช่วงเดียวถ้าหาไม่เจอ', () => {
    expect(highlight('ยำมาม่า', 'กุ้ง')).toEqual([{ text: 'ยำมาม่า', hit: false }])
  })

  it('ตัดช่วงที่ตรงออกมาเป็น hit', () => {
    expect(highlight('ยำมาม่าโคตรหมูสับ', 'มาม่า')).toEqual([
      { text: 'ยำ', hit: false },
      { text: 'มาม่า', hit: true },
      { text: 'โคตรหมูสับ', hit: false },
    ])
  })

  it('ไฮไลต์ได้หลายจุด', () => {
    expect(highlight('หมูสับ หมูกรอบ', 'หมู')).toEqual([
      { text: 'หมู', hit: true },
      { text: 'สับ ', hit: false },
      { text: 'หมู', hit: true },
      { text: 'กรอบ', hit: false },
    ])
  })

  it('ไฮไลต์ตรงต้นข้อความได้โดยไม่มีช่วงว่างนำหน้า', () => {
    expect(highlight('Corn Ribs', 'corn')).toEqual([
      { text: 'Corn', hit: true },
      { text: ' Ribs', hit: false },
    ])
  })
})
