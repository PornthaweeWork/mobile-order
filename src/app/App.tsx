import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Providers } from './providers'
import { FoundationCheckPage } from '@/features/foundation/FoundationCheckPage'

export function App() {
  return (
    <Providers>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<FoundationCheckPage />} />
          {/* route จริงของ EP-3 จะมาแทนที่ตรงนี้ */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </Providers>
  )
}
