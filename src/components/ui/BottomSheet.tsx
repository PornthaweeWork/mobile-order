import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

type Props = {
  open: boolean
  title: string
  /** ปิดเองไม่ได้ถ้าไม่ส่ง onClose มา — ใช้กับ sheet ที่ต้องเลือกก่อนถึงจะใช้งานต่อได้ */
  onClose?: () => void
  children: ReactNode
}

/**
 * Bottom sheet — S1.3
 * ใช้ <dialog> ของเบราว์เซอร์เพื่อให้ได้ focus trap และ Esc ฟรี
 *
 * ต้องใส่ margin เองทั้งหมด เพราะ Tailwind preflight รีเซ็ต margin ของทุก element
 * เป็น 0 ทำให้ margin auto ที่เบราว์เซอร์ใช้จัด dialog ให้อยู่กลางจอหายไป
 * มือถือ: mt-auto ดันไปติดขอบล่างเต็มความกว้าง — ต้อง max-w-none ด้วย
 *          เพราะ UA stylesheet ตั้ง max-width: calc(100% - 6px - 2em) ไว้ ทำให้เหลือขอบข้างละ 19px
 * แท็บเล็ตขึ้นไป: my-auto ให้ลอยอยู่กลางจอเป็นกล่องแคบ ๆ
 */
export function BottomSheet({ open, title, onClose, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-label={title}
      onCancel={(event) => {
        if (!onClose) event.preventDefault()
        else onClose()
      }}
      onClick={(event) => {
        // คลิกนอกกล่อง (ตัว backdrop คือ dialog เอง) ถึงจะปิด
        if (onClose && event.target === ref.current) onClose()
      }}
      className="mx-auto mt-auto mb-0 w-full max-w-none rounded-t-[var(--radius-xl)] bg-surface p-0 backdrop:bg-brand-950/50 md:my-auto md:max-w-md md:rounded-[var(--radius-xl)]"
    >
      <div className="pb-safe px-5 pt-4">
        {/* ที่จับสำหรับลากปิด — มีความหมายเฉพาะตอนเป็น sheet ติดขอบล่าง */}
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-line-strong md:hidden" />
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="font-display text-lg font-bold">{title}</h2>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="ปิด"
              className="grid size-9 place-items-center rounded-full bg-surface-2 text-ink-2"
            >
              ✕
            </button>
          )}
        </div>
        {children}
      </div>
    </dialog>
  )
}
