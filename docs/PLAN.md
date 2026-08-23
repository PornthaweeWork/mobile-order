# แผนงาน: Mobile Order Web App (LINE LIFF)

> เอกสารวางแผนก่อนเริ่มพัฒนา — ใช้สำหรับตัดสินใจว่าจะหยิบ Epic/Story ไหนเข้า Jira
> อัปเดตล่าสุด: 2026-08-21 · Repo: `PornthaweeWork/mobile-order`

---

## 1. สรุปสั้น (TL;DR)

- Repo มีอยู่แล้วแต่ **ว่างเปล่า** (ยังไม่มี commit) — พร้อม scaffold ได้ทันที
- แนะนำทำเป็น **Frontend-first**: React 19 + TypeScript + Vite + Tailwind v4 + MSW (mock API) เพื่อไม่ต้องรอ backend
- รันเป็น **LIFF app** ใน LINE (เปิดจาก Rich Menu หรือ QR ที่โต๊ะ) และ fallback เป็นเว็บปกติได้
- แบ่งงานเป็น **10 Epic / ~60 Story** รวมประมาณ **260 points** — MVP กินประมาณ **170 points**
- ประเมินคร่าว ๆ MVP: FE 1 คน ≈ **8–10 สัปดาห์**, FE 2 คน ≈ **5–6 สัปดาห์** (ยังไม่รวมเชื่อม backend จริง)
- Sprint 1 ที่แนะนำหยิบเข้า Jira ก่อน: **EP-0 (setup) + EP-1 (design system) + EP-3 บางส่วน (หน้าเมนู)** → ได้ demo เดินได้จริงใน 2 สัปดาห์

---

## 2. ความเข้าใจโจทย์ และสมมติฐาน

### สิ่งที่อ้างอิง

| อ้างอิง | จุดเด่นที่จะหยิบมา |
|---|---|
| FoodStory Mobile Order | สั่งจาก QR ที่โต๊ะ, เมนูแบ่งหมวด, ตัวเลือกเมนู, ตะกร้า, สรุปบิล + VAT/Service charge, สถานะออเดอร์ |
| Chagee (แอปสั่งน้ำ) | Customization ระดับลึก (ขนาด / ความหวาน / น้ำแข็ง / ท็อปปิ้ง), เลือกสาขารับเอง, สมาชิก + แต้มสะสม, สั่งซ้ำเร็ว |
| LINE LIFF | เปิดในแอป LINE, ดึงโปรไฟล์อัตโนมัติ, ไม่ต้อง login ใหม่, แจ้งสถานะผ่าน LINE |

### สมมติฐาน (ต้อง confirm)

1. **ยังไม่มี backend** → เริ่มด้วย mock API (MSW) ที่มี contract ชัดเจน แล้วค่อยสลับเป็น API จริง
2. **ร้านเดียวก่อน** แต่ออกแบบ data model แบบ multi-tenant เผื่อขยาย (route ใช้ `/r/:storeId`)
3. **ยังไม่มี LINE OA / LIFF ID** → ต้องสมัคร LINE Developers + สร้าง LIFF app (ต้องมี HTTPS endpoint)
4. **ยังไม่มี Figma** → FE ออกแบบเองจาก design tokens
5. **ภาษาไทยเป็นหลัก** แต่วางโครง i18n ไว้ให้เพิ่ม EN ได้

---

## 3. ขอบเขต (Scope)

### อยู่ในขอบเขต (In scope)
- Web app ฝั่งลูกค้า (customer-facing) เท่านั้น
- เปิดในแอป LINE ผ่าน LIFF + เปิดในเบราว์เซอร์ปกติได้
- ตั้งแต่เปิดเมนู → เลือกของ → ตะกร้า → checkout → ติดตามสถานะ
- Mock API ครบทุก endpoint พร้อม fixture ข้อมูลจริงเสมือน

### นอกขอบเขต (Out of scope — ต้องคุยแยก)
- ระบบหลังร้าน (KDS / POS / จัดการเมนู / รายงานยอดขาย)
- Backend API จริง + ฐานข้อมูล
- LINE Messaging API (Flex message แจ้งสถานะ) — เป็นงานฝั่ง backend
- ระบบ delivery จริง (จับคู่ไรเดอร์, คำนวณค่าส่งตามระยะทาง)
- Native app (iOS/Android)

---

## 4. Tech Stack

| ด้าน | เลือกใช้ | เหตุผล |
|---|---|---|
| Framework | React 19 + TypeScript (strict) | ตามที่ขอ, ecosystem กว้าง |
| Build | Vite 7 | เร็ว, config น้อย, เหมาะกับ SPA ใน LIFF |
| Styling | Tailwind CSS v4 | ตามที่ขอ, ใช้ CSS variables ทำ theme ต่อร้านได้ |
| Routing | React Router v7 (declarative) | เบา, พอสำหรับ SPA |
| Server state | TanStack Query v5 | cache/retry/invalidate ครบ, ลด boilerplate |
| Client state | Zustand + persist | ตะกร้าต้องอยู่รอด refresh (LIFF ปิด-เปิดบ่อย) |
| Form | react-hook-form + zod | validate ฟอร์ม checkout, type-safe |
| Mock API | MSW v2 | ใช้ handler เดียวกันทั้ง dev และ test |
| Bottom sheet | Vaul (หรือ Radix Dialog) | pattern หลักของ mobile order |
| LINE | `@line/liff` v2 | official SDK |
| Test | Vitest + Testing Library + Playwright | unit ที่ logic ราคา, e2e ที่ happy path |
| Quality | ESLint + Prettier + Husky + lint-staged + commitlint | กัน PR เละ |
| CI/CD | GitHub Actions + Vercel | preview URL ต่อ PR (สำคัญมากสำหรับเทส LIFF บนมือถือจริง) |

**ทางเลือกที่พิจารณาแล้วไม่เลือก:** Next.js — SEO ไม่จำเป็น (เปิดใน LINE), เพิ่มความซับซ้อน SSR/deployment โดยไม่ได้ประโยชน์ชัด ถ้าภายหลังต้องการหน้า public ที่ Google เห็น ค่อยย้ายได้

---

## 5. โครงสร้างโปรเจกต์

```
mobile-order/
├─ .github/workflows/ci.yml
├─ docs/                     # PLAN.md, API-CONTRACT.md, LIFF-SETUP.md
├─ e2e/                      # Playwright
├─ public/
└─ src/
   ├─ app/                   # router, providers, layouts, error boundary
   ├─ features/
   │  ├─ store/              # ข้อมูลร้าน, เวลาทำการ, service type
   │  ├─ menu/               # หมวดหมู่, การ์ดเมนู, ค้นหา
   │  ├─ item/               # bottom sheet เลือก option
   │  ├─ cart/               # ตะกร้า + คำนวณราคา
   │  ├─ checkout/           # ฟอร์ม + ชำระเงิน
   │  ├─ order/              # ยืนยัน, สถานะ, ประวัติ
   │  └─ member/             # สมาชิก, แต้ม (Phase 2)
   ├─ components/ui/         # design system (Button, Sheet, Chip, ...)
   ├─ lib/                   # liff.ts, api.ts, money.ts, format.ts
   ├─ mocks/                 # MSW handlers + fixtures
   ├─ stores/                # zustand (cart, session)
   ├─ types/                 # domain types (shared กับ mock)
   └─ styles/                # tokens.css, tailwind entry
```

---

## 6. หน้าจอทั้งหมด (Screen Inventory)

| Route | หน้าจอ | รายละเอียด | เฟส |
|---|---|---|---|
| `/r/:storeId` | หน้าร้าน + เมนู | cover, โลโก้, สถานะเปิด/ปิด, sticky category tabs, การ์ดเมนู | MVP |
| `/r/:storeId?table=12` | เข้าจาก QR โต๊ะ | จำเลขโต๊ะ, ล็อก service type เป็น dine-in | MVP |
| — (sheet) | เลือกรูปแบบรับสินค้า | ทานที่ร้าน / รับเอง / เดลิเวอรี่ | MVP |
| — (sheet) | รายละเอียดเมนู | รูป, คำอธิบาย, option groups, จำนวน, หมายเหตุ, ราคาสด | MVP |
| `/r/:storeId/cart` | ตะกร้า | แก้/ลบ/เพิ่มจำนวน, โค้ดส่วนลด, สรุปยอด | MVP |
| `/r/:storeId/checkout` | ชำระเงิน | ชื่อ-เบอร์ (prefill จาก LINE), เวลารับ, วิธีชำระ | MVP |
| `/r/:storeId/checkout/payment` | หน้าจ่ายเงิน | PromptPay QR / บัตร / จ่ายที่ร้าน | MVP (mock) |
| `/orders/:orderId` | ยืนยัน + ติดตามสถานะ | หมายเลขคิว, timeline สถานะ, ETA | MVP |
| `/orders` | ประวัติการสั่ง | รายการย้อนหลัง, ปุ่มสั่งซ้ำ | MVP-lite |
| `/me` | โปรไฟล์ / สมาชิก | แต้ม, คูปอง, ที่อยู่ที่บันทึก | Phase 2 |
| `/r/:storeId/closed` | ร้านปิด | เวลาเปิดถัดไป, ปุ่มสั่งล่วงหน้า | MVP |
| `*` | Not found / ลิงก์ไม่ถูกต้อง | | MVP |

### สถานะพิเศษที่ต้องออกแบบ (มักโดนลืม)
ร้านปิด · เมนูหมดระหว่างสั่ง · ตะกร้าว่าง · เน็ตหลุด · ออเดอร์ถูกยกเลิกจากร้าน · เปิดนอกแอป LINE · ยอดไม่ถึงขั้นต่ำ · โค้ดส่วนลดหมดอายุ

---

## 7. Flow หลัก

```
เปิดลิงก์ (LINE Rich Menu / QR โต๊ะ)
   ↓ liff.init() → ดึง profile
หน้าเมนูร้าน ── เลือกรูปแบบรับสินค้า
   ↓ แตะเมนู
Bottom sheet เลือก option → คำนวณราคาสด → เพิ่มลงตะกร้า
   ↓ sticky cart bar
ตะกร้า → ใส่โค้ดส่วนลด → สรุปยอด
   ↓
Checkout (prefill ชื่อ/เบอร์จาก LINE) → เลือกเวลา + วิธีชำระ
   ↓ POST /orders (idempotency key)
หน้าชำระเงิน → สำเร็จ
   ↓
หน้าติดตามสถานะ + หมายเลขคิว (polling)
   ↓
เสร็จสิ้น → e-receipt → ปุ่มสั่งซ้ำ
```

---

## 8. Data Model / API Contract (ร่าง)

```ts
type ServiceType = 'dine_in' | 'pickup' | 'delivery'

type Store = {
  id: string; slug: string; name: string
  logoUrl: string; coverUrl: string
  isOpen: boolean; openingHours: OpeningHour[]
  serviceTypes: ServiceType[]
  currency: 'THB'; vatRate: number; serviceChargeRate: number
  minimumOrder?: number; announcement?: string
}

type Category = { id: string; name: string; sortOrder: number }

type MenuItem = {
  id: string; categoryId: string
  name: string; description?: string; imageUrl?: string
  basePrice: number; isSoldOut: boolean
  tags: ('new' | 'recommended' | 'bestseller')[]
  optionGroups: OptionGroup[]
}

type OptionGroup = {
  id: string; name: string          // เช่น "ขนาด", "ระดับความหวาน", "ท็อปปิ้ง"
  type: 'single' | 'multi'
  required: boolean; min: number; max: number
  options: Option[]
}

type Option = { id: string; name: string; priceDelta: number; isDefault: boolean; isSoldOut: boolean }

type CartLine = {
  lineId: string; itemId: string; qty: number
  selectedOptionIds: string[]; note?: string
  unitPrice: number; lineTotal: number      // คำนวณฝั่ง client, ยืนยันอีกครั้งฝั่ง server
}

type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled'

type Order = {
  id: string; code: string; queueNumber?: string
  status: OrderStatus; serviceType: ServiceType
  tableNo?: string; pickupAt?: string; address?: Address
  lines: CartLine[]; summary: OrderSummary
  payment: { method: 'promptpay' | 'card' | 'cash'; status: 'unpaid' | 'paid' | 'failed' }
  createdAt: string
}

type OrderSummary = {
  subtotal: number; discount: number; deliveryFee: number
  serviceCharge: number; vat: number; grandTotal: number
}
```

### Endpoints (mock ก่อน)

| Method | Path | ใช้ทำอะไร |
|---|---|---|
| GET | `/api/stores/:slug` | ข้อมูลร้าน + สถานะเปิด/ปิด |
| GET | `/api/stores/:slug/menu` | หมวดหมู่ + เมนู + option groups |
| POST | `/api/promotions/validate` | เช็คโค้ดส่วนลด |
| POST | `/api/orders` | สร้างออเดอร์ (ต้องรองรับ `Idempotency-Key`) |
| GET | `/api/orders/:id` | ดึงสถานะออเดอร์ (polling ทุก 10 วิ) |
| GET | `/api/orders?userId=` | ประวัติการสั่ง |
| POST | `/api/payments/intent` | ขอ QR / payment token |

> **ข้อตกลงสำคัญ:** ราคาทั้งหมดเป็น "สตางค์" (integer) ไม่ใช้ float — กันปัญหาปัดเศษ ฝั่ง client คำนวณเพื่อโชว์เท่านั้น server เป็นผู้ตัดสินราคาจริงเสมอ

---

## 9. เรื่อง LINE / LIFF ที่ต้องรู้ก่อนเริ่ม

| หัวข้อ | รายละเอียด |
|---|---|
| สิ่งที่ต้องเตรียม | LINE Developers account → Provider → LINE Login channel → LIFF app (ได้ `LIFF ID`) |
| Endpoint | ต้องเป็น HTTPS → ใช้ Vercel preview URL ทดสอบระหว่างพัฒนา |
| Size | เลือก `Full` สำหรับ mobile order (ใช้พื้นที่เต็มจอ) |
| Profile | `liff.getProfile()` ได้ `userId`, `displayName`, `pictureUrl` → prefill checkout |
| Auth จริง | `liff.getIDToken()` → ส่งให้ backend verify กับ LINE ห้ามเชื่อ `userId` จาก client ตรง ๆ |
| นอกแอป LINE | `liff.isInClient()` = false → ต้องมี flow ให้กรอกชื่อ/เบอร์เอง ห้าม block |
| ปิดหน้าต่าง | `liff.closeWindow()` หลังสั่งเสร็จ (เฉพาะใน LINE) |
| แชร์ | `liff.shareTargetPicker()` แชร์ออเดอร์ให้เพื่อนช่วยจ่าย/ดู |
| ข้อควรระวัง UI | ไม่มีปุ่ม back ของเบราว์เซอร์ใน LIFF → ต้องมี back เอง; ต้องรองรับ `env(safe-area-inset-bottom)`; keyboard บน iOS ดัน viewport |
| PDPA | ต้องมี consent + หน้า Privacy Policy ก่อนเก็บเบอร์โทร/ที่อยู่ |

---

## 10. Epic & Story สำหรับ Jira

> Points = Fibonacci (1,2,3,5,8) · เฟส = MVP / P2 / P3

### EP-0 · Project Setup & Foundation — 20 pts · MVP

| ID | Story | Pts | เฟส |
|---|---|---|---|
| S0.1 | ตั้งโปรเจกต์ Vite + React 19 + TypeScript strict | 2 | MVP |
| S0.2 | ติดตั้ง Tailwind v4 + design tokens (CSS variables รองรับ theme ต่อร้าน) | 3 | MVP |
| S0.3 | ESLint + Prettier + Husky + lint-staged + commitlint | 2 | MVP |
| S0.4 | โครงสร้างโฟลเดอร์ + path alias + env config (`VITE_LIFF_ID`, `VITE_API_URL`) | 2 | MVP |
| S0.5 | GitHub Actions CI: lint / typecheck / test / build | 3 | MVP |
| S0.6 | Deploy Vercel: preview ต่อ PR + production (HTTPS สำหรับ LIFF) | 3 | MVP |
| S0.7 | MSW mock API + fixture ร้าน/เมนู/ออเดอร์ ที่สมจริง | 5 | MVP |

### EP-1 · Design System / UI Kit — 22 pts · MVP

| ID | Story | Pts | เฟส |
|---|---|---|---|
| S1.1 | Typography scale + color tokens + spacing (ฟอนต์ไทยอ่านง่ายบนมือถือ) | 3 | MVP |
| S1.2 | Base components: Button, IconButton, Input, Chip, Badge, Skeleton | 5 | MVP |
| S1.3 | BottomSheet / Modal + focus trap + swipe to dismiss | 3 | MVP |
| S1.4 | AppBar + Sticky bottom cart bar + safe-area insets | 3 | MVP |
| S1.5 | Toast / Empty state / Error state / Loading skeleton | 3 | MVP |
| S1.6 | Storybook สำหรับ UI kit | 5 | P2 |

### EP-2 · LIFF & Authentication — 18 pts

| ID | Story | Pts | เฟส |
|---|---|---|---|
| S2.1 | ติดตั้ง `@line/liff` + LiffProvider + loading gate ตอน init | 3 | MVP |
| S2.2 | ดึง LINE profile → prefill ชื่อ/รูปใน checkout | 3 | MVP |
| S2.3 | ส่ง ID token ให้ backend verify + จัดการ session | 5 | P2 |
| S2.4 | Fallback เมื่อเปิดนอกแอป LINE (เว็บปกติ) | 3 | MVP |
| S2.5 | `liff.closeWindow()` + `shareTargetPicker()` แชร์ออเดอร์ | 2 | P2 |
| S2.6 | PDPA consent + หน้า Privacy Policy | 2 | MVP |

### EP-3 · Store & Menu Browsing — 26 pts · MVP

| ID | Story | Pts | เฟส |
|---|---|---|---|
| S3.1 | หน้าร้าน: cover, โลโก้, สถานะเปิด/ปิด, เวลาทำการ, ประกาศ | 3 | MVP |
| S3.2 | เลือกรูปแบบรับสินค้า (dine-in / pickup / delivery) + จำ state | 5 | MVP |
| S3.3 | Sticky category tabs + scroll-spy sync สองทาง | 5 | MVP |
| S3.4 | การ์ดเมนู + lazy load รูป + ป้าย sold out / แนะนำ / ใหม่ | 5 | MVP |
| S3.5 | ค้นหาเมนู (client-side, debounce, ไฮไลต์คำค้น) | 3 | MVP |
| S3.6 | หน้าร้านปิด / ลิงก์ไม่ถูกต้อง / เมนูว่าง | 2 | MVP |
| S3.7 | Deep link `?table=xx` จาก QR → ล็อกเลขโต๊ะ | 3 | MVP |

### EP-4 · Item Customization & Cart — 37 pts · MVP (หัวใจของระบบ)

| ID | Story | Pts | เฟส |
|---|---|---|---|
| S4.1 | Bottom sheet รายละเอียดเมนู (รูปใหญ่, คำอธิบาย, ราคา) | 3 | MVP |
| S4.2 | Option groups: single/multi select + required + min/max validation | 8 | MVP |
| S4.3 | Preset แบบร้านเครื่องดื่ม: ขนาด / ความหวาน / น้ำแข็ง / ท็อปปิ้ง | 5 | MVP |
| S4.4 | คำนวณราคาเรียลไทม์ + ปุ่มจำนวน + ช่องหมายเหตุ | 3 | MVP |
| S4.5 | Cart store (Zustand + persist) + กันตะกร้าข้ามร้าน | 5 | MVP |
| S4.6 | หน้าตะกร้า: แก้ไข / ลบ / เพิ่มจำนวน / swipe to delete | 5 | MVP |
| S4.7 | Sticky cart bar แสดงจำนวน + ยอดรวมทุกหน้า | 2 | MVP |
| S4.8 | แก้ไขรายการเดิม (เปิด sheet พร้อม option ที่เลือกไว้) | 3 | MVP |
| S4.9 | จัดการเมนูหมดระหว่างสั่ง + ยอดขั้นต่ำ | 3 | MVP |

### EP-5 · Checkout & Payment — 40 pts

| ID | Story | Pts | เฟส |
|---|---|---|---|
| S5.1 | ฟอร์มผู้สั่ง (ชื่อ, เบอร์) ด้วย react-hook-form + zod | 3 | MVP |
| S5.2 | เลือกเวลารับ: ทันที / นัดเวลา (time slot ตามเวลาทำการ) | 5 | MVP |
| S5.3 | ที่อยู่จัดส่ง + พิกัดแผนที่ (delivery) | 8 | P2 |
| S5.4 | โค้ดส่วนลด / โปรโมชั่น | 5 | MVP |
| S5.5 | สรุปยอด: subtotal, ส่วนลด, service charge, VAT, ค่าส่ง | 3 | MVP |
| S5.6 | เลือกวิธีชำระ: PromptPay QR / บัตร / จ่ายที่ร้าน (UI + mock) | 5 | MVP |
| S5.7 | เชื่อม payment gateway จริง (Omise / 2C2P / GB Prime) | 8 | P2 |
| S5.8 | กันกดสั่งซ้ำ + idempotency key + หน้า processing | 3 | MVP |

### EP-6 · Order Tracking & History — 22 pts

| ID | Story | Pts | เฟส |
|---|---|---|---|
| S6.1 | หน้ายืนยันออเดอร์ + หมายเลขคิว | 3 | MVP |
| S6.2 | Timeline สถานะออเดอร์ + polling อัตโนมัติ | 5 | MVP |
| S6.3 | ประวัติการสั่ง + หน้ารายละเอียด | 5 | MVP |
| S6.4 | สั่งซ้ำ (reorder) จากประวัติ | 3 | P2 |
| S6.5 | ยกเลิกออเดอร์ภายในเวลาที่กำหนด | 3 | P2 |
| S6.6 | E-receipt / ใบเสร็จ | 3 | P2 |

### EP-7 · Member & Loyalty (แบบ Chagee) — 26 pts · P2/P3

| ID | Story | Pts | เฟส |
|---|---|---|---|
| S7.1 | สมัคร/ผูกสมาชิกด้วย LINE | 5 | P2 |
| S7.2 | แต้มสะสม + ประวัติแต้ม | 5 | P2 |
| S7.3 | คูปอง / e-stamp (ซื้อครบแถม) | 8 | P3 |
| S7.4 | Tier สมาชิก + สิทธิพิเศษ | 5 | P3 |
| S7.5 | โปรไฟล์ + ที่อยู่ที่บันทึกไว้ | 3 | P2 |

### EP-8 · Quality / i18n / A11y / Analytics — 31 pts

| ID | Story | Pts | เฟส |
|---|---|---|---|
| S8.1 | i18n ไทย/อังกฤษ (i18next) | 5 | P2 |
| S8.2 | A11y pass: focus, aria, contrast, touch target ≥ 44px | 5 | MVP |
| S8.3 | Performance: code split, image optimization, LCP < 2.5s บน 4G | 5 | MVP |
| S8.4 | Error boundary + Sentry | 3 | MVP |
| S8.5 | Analytics funnel: view_menu → add_to_cart → begin_checkout → purchase | 3 | P2 |
| S8.6 | Unit test จุดสำคัญ: คำนวณราคา, validate option, cart reducer | 5 | MVP |
| S8.7 | E2E Playwright: happy path สั่งอาหารครบ flow | 5 | MVP |

### EP-9 · Multi-tenant & Branding — 18 pts · P3

| ID | Story | Pts | เฟส |
|---|---|---|---|
| S9.1 | โหลด theme ต่อร้านจาก config (CSS variables runtime) | 5 | P3 |
| S9.2 | หลายสาขา + หน้าเลือกสาขา | 5 | P3 |
| S9.3 | หน้า preview สำหรับร้านตรวจก่อน publish | 5 | P3 |
| S9.4 | PWA: add to home screen + offline shell | 3 | P3 |

---

## 11. สรุปขนาดงาน

| Epic | รวม (pts) | ส่วนที่เป็น MVP |
|---|---|---|
| EP-0 Setup | 20 | 20 |
| EP-1 Design System | 22 | 17 |
| EP-2 LIFF & Auth | 18 | 10 |
| EP-3 Menu Browsing | 26 | 26 |
| EP-4 Customization & Cart | 37 | 37 |
| EP-5 Checkout & Payment | 40 | 24 |
| EP-6 Order Tracking | 22 | 13 |
| EP-7 Member & Loyalty | 26 | 0 |
| EP-8 Quality | 31 | 23 |
| EP-9 Multi-tenant | 18 | 0 |
| **รวม** | **260** | **170** |

**ประเมินเวลา MVP (170 pts):** FE 1 คน ≈ 8–10 สัปดาห์ · FE 2 คน ≈ 5–6 สัปดาห์
ถ้าตัด EP-8 บางส่วน (e2e, perf tuning) ออกไปทำทีหลัง เหลือ ~140 pts → 1 คน ≈ 7 สัปดาห์

> ตัวเลขนี้เป็นงาน **frontend + mock API เท่านั้น** ยังไม่รวมเวลาเชื่อม backend จริง (บวกเพิ่มประมาณ 20–30%) และไม่รวมงานออกแบบ UI ถ้าไม่มี Figma มาให้

---

## 12. Sprint Plan ที่แนะนำ

### Sprint 1 (2 สัปดาห์) — "เห็นเมนูได้จริง"
`EP-0 ทั้งหมด` + `S1.1–S1.5` + `S3.1, S3.3, S3.4`
→ **ส่งมอบ:** preview URL ที่เปิดดูเมนูร้านได้จริงจาก mock data, CI เขียว, design system พร้อมใช้

### Sprint 2 (2 สัปดาห์) — "สั่งของลงตะกร้าได้"
`EP-4 ทั้งหมด` + `S3.2, S3.5, S3.6, S3.7`
→ **ส่งมอบ:** เลือก option, คำนวณราคา, ตะกร้าครบ, เข้าจาก QR โต๊ะได้

### Sprint 3 (2 สัปดาห์) — "สั่งจบได้"
`EP-5 (ส่วน MVP)` + `S6.1, S6.2` + `S2.1, S2.2, S2.4, S2.6`
→ **ส่งมอบ:** สั่งจบครบ flow ใน LINE จริง, ติดตามสถานะได้

### Sprint 4 (2 สัปดาห์) — "พร้อมขึ้น production"
`S6.3` + `EP-8 (ส่วน MVP)` + เชื่อม API จริง + UAT
→ **ส่งมอบ:** ผ่าน a11y/perf, มี test, พร้อม release

---

## 13. Definition of Done

- [ ] TypeScript ไม่มี error, ESLint ไม่มี warning
- [ ] ทดสอบบนมือถือจริงในแอป LINE (iOS + Android) ไม่ใช่แค่ DevTools
- [ ] มี loading / empty / error state ครบทุกหน้า
- [ ] Touch target ≥ 44px, contrast ผ่าน WCAG AA
- [ ] Lighthouse mobile: Performance ≥ 85, Accessibility ≥ 95
- [ ] มี unit test สำหรับ logic คำนวณราคาและ validate option
- [ ] ผ่าน review + preview URL ให้ตรวจได้

---

## 14. คำถามที่ต้องตัดสินใจก่อนเริ่ม

| # | คำถาม | ทำไมสำคัญ |
|---|---|---|
| 1 | มี backend / API แล้วหรือยัง? จะใช้ API ของ FoodStory หรือทำเอง? | กำหนดว่าจะ mock นานแค่ไหน และใครกำหนด contract |
| 2 | ร้านเดียว หรือ multi-tenant หลายร้าน? | กระทบ routing, theming, data model ตั้งแต่แรก |
| 3 | MVP เอาช่องทางไหน — dine-in QR / รับเอง / เดลิเวอรี่? | delivery แพงที่สุด (ที่อยู่ + แผนที่ + ค่าส่ง) ตัดออกได้ ~15 pts |
| 4 | Payment gateway ตัวไหน? หรือ MVP ให้จ่ายที่ร้านไปก่อน? | S5.7 เป็นงาน 8 pts + ต้องมี merchant account |
| 5 | มี LINE OA / LIFF ID แล้วหรือยัง? | ถ้ายัง ต้องเผื่อเวลาสมัคร + verify |
| 6 | มี Figma design ไหม หรือให้ FE ออกแบบเอง? | ถ้ามี ดึงจาก Figma มาทำเป็นโค้ดได้เลย |
| 7 | เอาระบบสมาชิก/แต้ม (แบบ Chagee) ด้วยไหม? | EP-7 = 26 pts และต้องมี backend รองรับ |
| 8 | ต้องรองรับภาษาอังกฤษด้วยไหม? | i18n ทำตั้งแต่แรกถูกกว่ามาก retrofit ทีหลัง |
| 9 | Deploy ที่ไหน — Vercel / Cloud Run / on-prem? | กระทบ CI/CD และ HTTPS domain สำหรับ LIFF |
| 10 | ต้องใช้งานนอก LINE (เว็บปกติ) ด้วยไหม? | กระทบ auth flow และการเก็บข้อมูลลูกค้า |

---

## 15. ขั้นถัดไป

1. รีวิวเอกสารนี้ → ตอบคำถามข้อ 14 (อย่างน้อยข้อ 1, 2, 3, 6)
2. เลือก Epic/Story ที่จะหยิบเข้า Jira (แนะนำเริ่มจาก Sprint 1)
3. สั่ง scaffold โปรเจกต์ตาม EP-0 → จะได้ repo ที่ `npm run dev` ขึ้นทันที พร้อม CI
