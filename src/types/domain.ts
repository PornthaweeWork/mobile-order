/**
 * Domain types — สัญญาเดียวกันทั้ง mock API และ backend จริง
 * ราคาทั้งหมดเป็น "สตางค์" (integer) ห้ามใช้ float เพื่อกันปัญหาปัดเศษ
 */

export type ServiceType = 'dine_in' | 'pickup' | 'delivery'

export type OpeningHour = {
  /** 0 = อาทิตย์ … 6 = เสาร์ */
  day: 0 | 1 | 2 | 3 | 4 | 5 | 6
  /** "09:00" */
  open: string
  /** "20:00" */
  close: string
}

export type Store = {
  id: string
  slug: string
  name: string
  logoUrl: string
  coverUrl: string
  isOpen: boolean
  openingHours: OpeningHour[]
  serviceTypes: ServiceType[]
  currency: 'THB'
  /** 0.07 = 7% */
  vatRate: number
  serviceChargeRate: number
  minimumOrder?: number
  announcement?: string
}

export type Category = {
  id: string
  name: string
  sortOrder: number
}

export type Option = {
  id: string
  name: string
  /** ส่วนต่างราคาเป็นสตางค์ ติดลบได้ */
  priceDelta: number
  isDefault: boolean
  isSoldOut: boolean
}

export type OptionGroup = {
  id: string
  name: string
  type: 'single' | 'multi'
  required: boolean
  min: number
  max: number
  options: Option[]
}

export type MenuItemTag = 'new' | 'recommended' | 'bestseller'

export type MenuItem = {
  id: string
  categoryId: string
  name: string
  description?: string
  imageUrl?: string
  /** สตางค์ */
  basePrice: number
  isSoldOut: boolean
  tags: MenuItemTag[]
  optionGroups: OptionGroup[]
}

export type Menu = {
  categories: Category[]
  items: MenuItem[]
}

export type CartLine = {
  lineId: string
  itemId: string
  qty: number
  selectedOptionIds: string[]
  note?: string
  unitPrice: number
  lineTotal: number
}

export type OrderStatus =
  'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled'

export type OrderSummary = {
  subtotal: number
  discount: number
  deliveryFee: number
  serviceCharge: number
  vat: number
  grandTotal: number
}

export type Order = {
  id: string
  code: string
  queueNumber?: string
  status: OrderStatus
  serviceType: ServiceType
  tableNo?: string
  pickupAt?: string
  lines: CartLine[]
  summary: OrderSummary
  payment: {
    method: 'promptpay' | 'card' | 'cash'
    status: 'unpaid' | 'paid' | 'failed'
  }
  createdAt: string
}
