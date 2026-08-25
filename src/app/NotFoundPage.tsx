import { BrandMark } from '@/components/ui/BrandMark'

export function NotFoundPage({ message = 'ไม่พบหน้าที่คุณเปิด' }: { message?: string }) {
  return (
    <div className="grid min-h-dvh place-items-center bg-paper px-6 text-center">
      <div className="flex flex-col items-center gap-3">
        <BrandMark tone="brown" size={56} className="opacity-40" />
        <h1 className="font-display text-xl font-bold">{message}</h1>
        <p className="max-w-[32ch] text-sm text-ink-3">
          ลองสแกน QR ที่โต๊ะอีกครั้ง หรือเปิดจากลิงก์ในไลน์ของร้าน
        </p>
      </div>
    </div>
  )
}
