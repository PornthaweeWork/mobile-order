/**
 * ทุกจำนวนเงินในระบบเก็บเป็น "สตางค์" (integer)
 * ห้ามใช้ float กับเงินเด็ดขาด — 0.1 + 0.2 !== 0.3
 */

const SATANG_PER_BAHT = 100

export const baht = (amount: number): number => Math.round(amount * SATANG_PER_BAHT)

export const toBaht = (satang: number): number => satang / SATANG_PER_BAHT

const formatter = new Intl.NumberFormat('th-TH', {
  style: 'currency',
  currency: 'THB',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

export const formatPrice = (satang: number): string => formatter.format(toBaht(satang))

/** ปัดเป็นจำนวนเต็มสตางค์เสมอ ใช้ตอนคิด VAT / service charge */
export const applyRate = (satang: number, rate: number): number => Math.round(satang * rate)
