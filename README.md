# Mobile Order — LINE Web App

เว็บแอปสั่งอาหาร/เครื่องดื่มสำหรับใช้งานในแอป LINE (LIFF) สร้างด้วย React + TypeScript + Tailwind CSS

**🔗 Production:** https://okamoo.vercel.app (deploy อัตโนมัติจาก `main`)
ทุก PR จะได้ preview URL ของตัวเองจาก Vercel อัตโนมัติ

## สถานะ

กำลังทำ **EP-0 · Project Setup & Foundation** — โครงโปรเจกต์พร้อมใช้แล้ว ยังไม่เริ่ม UI จริง
หน้าแรกตอนนี้เป็น _Foundation check_ ไว้ยืนยันว่า build, styling, routing และ mock API ทำงานครบ

🎨 [Design System `docs/DESIGN-SYSTEM.md`](docs/DESIGN-SYSTEM.md) — สี ตัวพิมพ์ โลโก้ และกติกาการใช้

📋 [แผนงานฉบับเต็ม `docs/PLAN.md`](docs/PLAN.md) — ขอบเขต, tech stack, หน้าจอทั้งหมด,
data model, Epic/Story สำหรับ Jira, sprint plan และคำถามที่ต้องตัดสินใจก่อนเริ่ม

## เริ่มพัฒนา

```bash
npm install
cp .env.example .env      # ยังไม่ต้องกรอกอะไร ระบบจะใช้ mock API ให้เอง
npm run dev               # http://localhost:5173
```

| คำสั่ง              | ทำอะไร                                    |
| ------------------- | ----------------------------------------- |
| `npm run dev`       | dev server (เปิดจากมือถือในวงเดียวกันได้) |
| `npm run build`     | typecheck + build production              |
| `npm run lint`      | ESLint                                    |
| `npm run format`    | Prettier                                  |
| `npm run typecheck` | ตรวจ type อย่างเดียว                      |
| `npm test`          | unit test (Vitest)                        |

## Mock API

ยังไม่มี backend จริง — ถ้าไม่ตั้ง `VITE_API_URL` ระบบจะเปิด [MSW](https://mswjs.io) ให้อัตโนมัติ
โดยตอบจาก fixture ใน `src/mocks/` ตาม contract เดียวกับที่ระบุไว้ใน `docs/PLAN.md`

เมื่อ backend จริงพร้อม แค่ตั้ง `VITE_API_URL` แล้ว mock จะปิดเอง

## โครงสร้าง

```
src/
├─ app/          router · providers · layouts
├─ features/     แยกตามโดเมน (menu, cart, checkout, order, …)
├─ components/ui design system
├─ lib/          liff · api client · money · env
├─ mocks/        MSW handlers + fixtures
├─ stores/       zustand
├─ types/        domain types
└─ styles/       design tokens + tailwind entry
```

## ข้อตกลงสำคัญ

- **เงินเก็บเป็นสตางค์ (integer) เสมอ** ห้ามใช้ float — ดู `src/lib/money.ts`
- ฝั่ง client คำนวณราคาเพื่อ**แสดงผล**เท่านั้น server เป็นผู้ตัดสินราคาจริง
- Design tokens ทั้งหมดเป็น CSS variable เพื่อให้ override theme ต่อร้านได้ตอน runtime
- Commit ตาม [Conventional Commits](https://www.conventionalcommits.org) (บังคับด้วย commitlint)
