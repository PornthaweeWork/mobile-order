import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from '@/app/App'
import { env } from '@/lib/env'
import '@/styles/index.css'

async function enableMocking() {
  if (!env.useMock) return
  const { worker } = await import('@/mocks/browser')
  await worker.start({ onUnhandledRequest: 'bypass' })
}

const container = document.getElementById('root')
if (!container) throw new Error('ไม่พบ #root element')

void enableMocking().then(() => {
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
