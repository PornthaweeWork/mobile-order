import { useEffect, useMemo, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { EmptyState } from '@/components/ui/EmptyState'
import { SearchInput } from '@/components/ui/SearchInput'
import { CategoryTabs } from '@/features/menu/CategoryTabs'
import { MenuCard } from '@/features/menu/MenuCard'
import { ServiceTypePicker } from '@/features/store/ServiceTypePicker'
import { StoreHeader } from '@/features/store/StoreHeader'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useScrollSpy } from '@/hooks/useScrollSpy'
import { ApiError, api } from '@/lib/api'
import { matchesQuery } from '@/lib/search'
import { useSession } from '@/stores/session'
import { NotFoundPage } from '@/app/NotFoundPage'

/** ความสูงของแถบหมวดหมู่ที่ค้างอยู่ ใช้เผื่อระยะตอนกระโดดและตอนทำ scroll spy */
const TAB_BAR_HEIGHT = 58

export function StorePage() {
  const { storeSlug = '' } = useParams()
  const [searchParams] = useSearchParams()
  const table = searchParams.get('table')

  const { serviceType, tableNo, setServiceType, lockToTable } = useSession()
  const [pickerOpen, setPickerOpen] = useState(false)
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebouncedValue(query)

  const storeQuery = useQuery({
    queryKey: ['store', storeSlug],
    queryFn: () => api.getStore(storeSlug),
    retry: (count, error) => !(error instanceof ApiError && error.status === 404) && count < 1,
  })
  const menuQuery = useQuery({
    queryKey: ['menu', storeSlug],
    queryFn: () => api.getMenu(storeSlug),
    enabled: storeQuery.isSuccess,
  })

  // เข้าจาก QR ที่โต๊ะ — ล็อกเป็นทานที่ร้านทันที ไม่ต้องถาม
  useEffect(() => {
    if (table !== null && table !== '') lockToTable(table)
  }, [table, lockToTable])

  // ยังไม่เคยเลือกช่องทาง และไม่ได้มาจาก QR → เด้ง sheet ให้เลือกก่อน
  useEffect(() => {
    if (storeQuery.isSuccess && serviceType === undefined && tableNo === undefined) {
      setPickerOpen(true)
    }
  }, [storeQuery.isSuccess, serviceType, tableNo])

  const categories = useMemo(() => {
    const all = menuQuery.data?.categories ?? []
    return [...all].sort((a, b) => a.sortOrder - b.sortOrder)
  }, [menuQuery.data])

  const itemsByCategory = useMemo(() => {
    const items = (menuQuery.data?.items ?? []).filter((item) => matchesQuery(item, debouncedQuery))
    return categories
      .map((category) => ({
        category,
        items: items.filter((item) => item.categoryId === category.id),
      }))
      .filter((section) => section.items.length > 0)
  }, [menuQuery.data, categories, debouncedQuery])

  const sectionIds = useMemo(() => itemsByCategory.map((s) => s.category.id), [itemsByCategory])
  const activeId = useScrollSpy(sectionIds, TAB_BAR_HEIGHT)

  const jumpTo = (categoryId: string) => {
    const element = document.getElementById(categoryId)
    if (!element) return
    const top = element.getBoundingClientRect().top + window.scrollY - TAB_BAR_HEIGHT
    window.scrollTo({ top, behavior: 'smooth' })
  }

  if (storeQuery.isError) {
    const notFound = storeQuery.error instanceof ApiError && storeQuery.error.status === 404
    return notFound ? (
      <NotFoundPage message="ไม่พบร้านนี้ ลิงก์อาจหมดอายุหรือพิมพ์ผิด" />
    ) : (
      <NotFoundPage message="โหลดข้อมูลร้านไม่สำเร็จ ลองใหม่อีกครั้ง" />
    )
  }

  if (storeQuery.isPending || !storeQuery.data) return <StoreSkeleton />

  const store = storeQuery.data
  const now = new Date()

  return (
    <div className="min-h-dvh bg-paper pb-12">
      <StoreHeader
        store={store}
        now={now}
        serviceType={serviceType}
        tableNo={tableNo}
        onChangeServiceType={() => {
          if (tableNo === undefined) setPickerOpen(true)
        }}
      />

      {categories.length > 0 && (
        <CategoryTabs categories={categories} activeId={activeId} onSelect={jumpTo} />
      )}

      <main className="container-page py-4 md:py-6">
        <div className="mb-4 md:mb-6 md:max-w-sm">
          <SearchInput value={query} onChange={setQuery} placeholder="ค้นหาเมนู" />
        </div>

        {menuQuery.isPending ? (
          <MenuSkeleton />
        ) : menuQuery.isError ? (
          <EmptyState title="โหลดเมนูไม่สำเร็จ" description="เช็คสัญญาณอินเทอร์เน็ตแล้วลองใหม่" />
        ) : itemsByCategory.length === 0 ? (
          <EmptyState
            title={debouncedQuery ? 'ไม่เจอเมนูที่ค้นหา' : 'ยังไม่มีเมนู'}
            description={
              debouncedQuery
                ? `ลองพิมพ์คำอื่นดู — ไม่มีเมนูที่ตรงกับ "${debouncedQuery}"`
                : 'ร้านยังไม่ได้ลงเมนู กลับมาดูใหม่อีกครั้งนะ'
            }
          />
        ) : (
          <div className="flex flex-col gap-7">
            {itemsByCategory.map(({ category, items }) => (
              <section key={category.id} id={category.id} className="scroll-mt-16">
                <h2 className="mb-2.5 font-display text-lg font-bold md:text-xl">
                  {category.name}
                </h2>
                <ul className="grid gap-3 md:grid-cols-2">
                  {items.map((item) => (
                    <MenuCard key={item.id} item={item} query={debouncedQuery} />
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </main>

      <ServiceTypePicker
        open={pickerOpen}
        available={store.serviceTypes}
        selected={serviceType}
        {...(serviceType !== undefined ? { onClose: () => setPickerOpen(false) } : {})}
        onSelect={(type) => {
          setServiceType(type)
          setPickerOpen(false)
        }}
      />
    </div>
  )
}

function StoreSkeleton() {
  return (
    <div className="min-h-dvh animate-pulse bg-paper">
      <div className="h-44 bg-brand-700" />
      <div className="container-page py-5">
        <div className="h-11 rounded-[var(--radius-pill)] bg-surface-2" />
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <div className="h-28 rounded-[var(--radius-md)] bg-surface-2" />
          <div className="h-28 rounded-[var(--radius-md)] bg-surface-2" />
        </div>
      </div>
    </div>
  )
}

function MenuSkeleton() {
  return (
    <div className="grid animate-pulse gap-3 md:grid-cols-2">
      <div className="h-28 rounded-[var(--radius-md)] bg-surface-2" />
      <div className="h-28 rounded-[var(--radius-md)] bg-surface-2" />
      <div className="h-28 rounded-[var(--radius-md)] bg-surface-2" />
    </div>
  )
}
