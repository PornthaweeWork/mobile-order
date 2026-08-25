import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Providers } from './providers'
import { NotFoundPage } from './NotFoundPage'
import { DesignSystemPage } from '@/features/brand/DesignSystemPage'
import { StorePage } from '@/features/menu/StorePage'

/** ร้านเดียวก่อน — พอทำ multi-tenant (EP-9) ค่อยเอา slug มาจาก LIFF หรือ subdomain */
const DEFAULT_STORE = 'okamoo'

export function App() {
  return (
    <Providers>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to={`/r/${DEFAULT_STORE}`} replace />} />
          <Route path="/r/:storeSlug" element={<StorePage />} />
          <Route path="/design-system" element={<DesignSystemPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </Providers>
  )
}
