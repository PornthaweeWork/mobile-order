import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ServiceType } from '@/types/domain'

type SessionState = {
  serviceType: ServiceType | undefined
  /** เลขโต๊ะจาก QR — ถ้ามีแปลว่าลูกค้านั่งอยู่ที่ร้าน ห้ามเปลี่ยนเป็นช่องทางอื่น */
  tableNo: string | undefined
  setServiceType: (type: ServiceType) => void
  /** เรียกตอนเปิดจาก QR ที่โต๊ะ — ล็อกเป็นทานที่ร้านให้เลย */
  lockToTable: (tableNo: string) => void
  clearTable: () => void
}

export const useSession = create<SessionState>()(
  persist(
    (set) => ({
      serviceType: undefined,
      tableNo: undefined,
      setServiceType: (type) =>
        set((state) => (state.tableNo === undefined ? { serviceType: type } : state)),
      lockToTable: (tableNo) => set({ tableNo, serviceType: 'dine_in' }),
      clearTable: () => set({ tableNo: undefined }),
    }),
    { name: 'okamoo.session' },
  ),
)

/** ล็อกช่องทางอยู่ไหม (เข้าจาก QR ที่โต๊ะ) */
export const isServiceTypeLocked = (state: Pick<SessionState, 'tableNo'>): boolean =>
  state.tableNo !== undefined
