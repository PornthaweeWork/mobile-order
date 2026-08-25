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
      className="w-full max-w-2xl rounded-t-[var(--radius-xl)] bg-surface p-0 backdrop:bg-brand-950/50 open:mt-auto open:mb-0"
    >
      <div className="pb-safe px-5 pt-4">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-line-strong" />
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
