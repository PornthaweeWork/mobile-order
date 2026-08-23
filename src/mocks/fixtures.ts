import { baht } from '@/lib/money'
import type { Menu, Store } from '@/types/domain'

export const store: Store = {
  id: 'store_001',
  slug: 'demo',
  name: 'ชาไทยหอมกรุ่น สาขาสยาม',
  logoUrl: '',
  coverUrl: '',
  isOpen: true,
  openingHours: [
    { day: 1, open: '09:00', close: '20:00' },
    { day: 2, open: '09:00', close: '20:00' },
    { day: 3, open: '09:00', close: '20:00' },
    { day: 4, open: '09:00', close: '20:00' },
    { day: 5, open: '09:00', close: '21:00' },
    { day: 6, open: '10:00', close: '21:00' },
    { day: 0, open: '10:00', close: '18:00' },
  ],
  serviceTypes: ['dine_in', 'pickup', 'delivery'],
  currency: 'THB',
  vatRate: 0.07,
  serviceChargeRate: 0.1,
  minimumOrder: baht(100),
  announcement: 'ช่วง 14:00–16:00 ทุกวัน ลด 20% ทุกเมนูชานม',
}

const sweetness = {
  id: 'grp_sweet',
  name: 'ระดับความหวาน',
  type: 'single' as const,
  required: true,
  min: 1,
  max: 1,
  options: [
    { id: 'sweet_0', name: 'ไม่หวาน', priceDelta: 0, isDefault: false, isSoldOut: false },
    { id: 'sweet_25', name: 'หวานน้อย 25%', priceDelta: 0, isDefault: false, isSoldOut: false },
    { id: 'sweet_50', name: 'หวานปกติ 50%', priceDelta: 0, isDefault: true, isSoldOut: false },
    { id: 'sweet_100', name: 'หวานมาก 100%', priceDelta: 0, isDefault: false, isSoldOut: false },
  ],
}

const size = {
  id: 'grp_size',
  name: 'ขนาด',
  type: 'single' as const,
  required: true,
  min: 1,
  max: 1,
  options: [
    { id: 'size_m', name: 'ปกติ (16 oz)', priceDelta: 0, isDefault: true, isSoldOut: false },
    {
      id: 'size_l',
      name: 'ใหญ่ (22 oz)',
      priceDelta: baht(15),
      isDefault: false,
      isSoldOut: false,
    },
  ],
}

const toppings = {
  id: 'grp_topping',
  name: 'ท็อปปิ้ง (เลือกได้สูงสุด 3)',
  type: 'multi' as const,
  required: false,
  min: 0,
  max: 3,
  options: [
    { id: 'top_pearl', name: 'ไข่มุก', priceDelta: baht(10), isDefault: false, isSoldOut: false },
    {
      id: 'top_jelly',
      name: 'เยลลี่ชาเขียว',
      priceDelta: baht(10),
      isDefault: false,
      isSoldOut: false,
    },
    {
      id: 'top_pudding',
      name: 'พุดดิ้งไข่',
      priceDelta: baht(15),
      isDefault: false,
      isSoldOut: false,
    },
    { id: 'top_cream', name: 'ครีมชีส', priceDelta: baht(20), isDefault: false, isSoldOut: true },
  ],
}

export const menu: Menu = {
  categories: [
    { id: 'cat_signature', name: 'เมนูแนะนำ', sortOrder: 1 },
    { id: 'cat_tea', name: 'ชานม', sortOrder: 2 },
    { id: 'cat_coffee', name: 'กาแฟ', sortOrder: 3 },
    { id: 'cat_snack', name: 'ของทานเล่น', sortOrder: 4 },
  ],
  items: [
    {
      id: 'item_001',
      categoryId: 'cat_signature',
      name: 'ชาไทยไข่มุกบราวน์ชูการ์',
      description: 'ชาไทยแท้ชงสด ราดบราวน์ชูการ์ ไข่มุกเคี้ยวหนึบต้มใหม่ทุก 2 ชั่วโมง',
      basePrice: baht(65),
      isSoldOut: false,
      tags: ['bestseller', 'recommended'],
      optionGroups: [size, sweetness, toppings],
    },
    {
      id: 'item_002',
      categoryId: 'cat_signature',
      name: 'ชาเขียวมัทฉะลาเต้',
      description: 'มัทฉะเกรดพิธีจากอุจิ ตีสดกับนมสดฮอกไกโด',
      basePrice: baht(75),
      isSoldOut: false,
      tags: ['new'],
      optionGroups: [size, sweetness, toppings],
    },
    {
      id: 'item_003',
      categoryId: 'cat_tea',
      name: 'ชานมไต้หวัน',
      description: 'ชาอู่หลงคั่วหอม ตัดเลี่ยนด้วยนมสด',
      basePrice: baht(55),
      isSoldOut: false,
      tags: [],
      optionGroups: [size, sweetness, toppings],
    },
    {
      id: 'item_004',
      categoryId: 'cat_coffee',
      name: 'อเมริกาโน่เย็น',
      description: 'เมล็ดอาราบิก้าดอยช้าง คั่วกลาง',
      basePrice: baht(60),
      isSoldOut: true,
      tags: [],
      optionGroups: [size],
    },
    {
      id: 'item_005',
      categoryId: 'cat_snack',
      name: 'ขนมปังปิ้งเนยนม',
      description: 'ปิ้งสด ราดเนยสดและนมข้น',
      basePrice: baht(45),
      isSoldOut: false,
      tags: [],
      optionGroups: [],
    },
  ],
}
