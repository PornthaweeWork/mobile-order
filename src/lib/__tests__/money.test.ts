import { describe, expect, it } from 'vitest'
import { applyRate, baht, formatPrice, toBaht } from '../money'

describe('money', () => {
  it('แปลงบาทเป็นสตางค์แบบไม่มีเศษลอย', () => {
    expect(baht(65)).toBe(6500)
    expect(baht(0.1) + baht(0.2)).toBe(baht(0.3))
  })

  it('แปลงสตางค์กลับเป็นบาท', () => {
    expect(toBaht(6500)).toBe(65)
  })

  it('คิด VAT แล้วปัดเป็นจำนวนเต็มสตางค์', () => {
    expect(applyRate(6500, 0.07)).toBe(455)
    // 333 * 7% = 23.31 สตางค์ ต้องปัดเป็น 23
    expect(applyRate(333, 0.07)).toBe(23)
  })

  it('format เป็นสกุลเงินบาท', () => {
    expect(formatPrice(6500)).toContain('65')
  })
})
