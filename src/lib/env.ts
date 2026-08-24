/** อ่าน env ที่จุดเดียว จะได้รู้ว่าโปรเจกต์พึ่ง env ตัวไหนบ้าง */
export const env = {
  liffId: import.meta.env.VITE_LIFF_ID ?? '',
  apiUrl: import.meta.env.VITE_API_URL ?? '',
  /** ไม่ได้ตั้ง VITE_API_URL = ยังไม่มี backend จริง → เปิด mock ให้อัตโนมัติ */
  get useMock(): boolean {
    const flag = import.meta.env.VITE_ENABLE_MOCK
    if (flag === 'true') return true
    if (flag === 'false') return false
    return this.apiUrl === ''
  },
}
