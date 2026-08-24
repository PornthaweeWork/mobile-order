// @vitest-environment node
// (ต้องใช้ node env เพื่ออ่านไฟล์ tokens.css จากดิสก์ — jsdom ทำให้ import.meta.url เป็น http)
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

/**
 * ล็อกคู่สีของ design system ให้ผ่าน WCAG AA
 *
 * อ่านค่าจาก tokens.css โดยตรง เพื่อไม่ให้ค่าใน test กับค่าจริงหลุดจากกัน
 * ถ้าใครแก้ token แล้วคอนทราสต์ตก test นี้จะพัง — ตั้งใจให้เป็นแบบนั้น (S8.2)
 */

const css = readFileSync(fileURLToPath(new URL('../tokens.css', import.meta.url)), 'utf8')

const tokens = Object.fromEntries(
  [...css.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})/g)].map((m) => [
    m[1] as string,
    m[2] as string,
  ]),
) as Record<string, string>

function relativeLuminance(hex: string): number {
  const channels = [1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16) / 255)
  const [r, g, b] = channels.map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * (r as number) + 0.7152 * (g as number) + 0.0722 * (b as number)
}

function contrast(foreground: string, background: string): number {
  const a = relativeLuminance(foreground)
  const b = relativeLuminance(background)
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
}

const WHITE = '#ffffff'

/** [ตัวอักษร, พื้นหลัง, อัตราขั้นต่ำ] — 4.5 = ตัวอักษรปกติ, 3 = ตัวใหญ่/องค์ประกอบ UI */
const PAIRS: Array<[string, string, number]> = [
  ['ink', 'paper', 4.5],
  ['ink', 'surface', 4.5],
  ['ink-2', 'paper', 4.5],
  ['ink-2', 'surface-2', 4.5],
  ['ink-3', 'surface', 4.5],
  ['flame-600', 'surface', 4.5],
  ['flame-700', 'flame-100', 4.5],
  ['brand-700', 'brand-100', 4.5],
  ['ink-inverse', 'brand-700', 4.5],
  ['ink-inverse-2', 'brand-700', 4.5],
  ['pop-700', 'pop-400', 4.5],
  ['success', 'success-bg', 4.5],
  ['warning', 'warning-bg', 4.5],
  ['danger', 'danger-bg', 4.5],
]

/** พื้นปุ่มที่มีตัวอักษรสีขาวทับ */
const WHITE_ON: Array<[string, number]> = [
  ['flame-600', 4.5],
  ['brand-700', 4.5],
  ['brand-800', 4.5],
]

describe('design tokens', () => {
  it('อ่าน token จาก tokens.css ได้', () => {
    expect(tokens['brand-700']).toBe('#722815')
    expect(Object.keys(tokens).length).toBeGreaterThan(30)
  })

  it('สีแบรนด์ตรงกับคู่มือ (ห้ามแก้ค่าเหล่านี้)', () => {
    expect(tokens['okamoo-grilled-pork-brown']).toBe('#722815')
    expect(tokens['okamoo-amber-flame']).toBe('#ff825c')
    expect(tokens['okamoo-piglet-cream']).toBe('#e8bd84')
    expect(tokens['okamoo-freshy-orange']).toBe('#e24305')
    expect(tokens['okamoo-yellow-pop']).toBe('#f9ef7a')
    expect(tokens['okamoo-dark-brown']).toBe('#844526')
    expect(tokens['okamoo-charcoal-black']).toBe('#473e37')
  })

  it.each(PAIRS)('%s บน %s ผ่าน WCAG AA', (fg, bg, min) => {
    const fgHex = tokens[fg]
    const bgHex = tokens[bg]
    expect(fgHex, `ไม่พบ token --${fg}`).toBeDefined()
    expect(bgHex, `ไม่พบ token --${bg}`).toBeDefined()
    expect(contrast(fgHex as string, bgHex as string)).toBeGreaterThanOrEqual(min)
  })

  it.each(WHITE_ON)('ตัวอักษรขาวบน %s ผ่าน WCAG AA', (bg, min) => {
    expect(contrast(WHITE, tokens[bg] as string)).toBeGreaterThanOrEqual(min)
  })

  it('touch target ขั้นต่ำอย่างน้อย 44px', () => {
    expect(css).toMatch(/--tap-min:\s*44px/)
  })
})
