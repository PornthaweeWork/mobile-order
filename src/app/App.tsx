import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Providers } from './providers'
import { DesignSystemPage } from '@/features/brand/DesignSystemPage'

export function App() {
  return (
    <Providers>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DesignSystemPage />} />
          {/* route จริงของ EP-3 จะมาแทนที่ตรงนี้ */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </Providers>
  )
}
