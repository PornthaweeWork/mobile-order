import { HttpResponse, delay, http } from 'msw'
import { menu, store } from './fixtures'

/** หน่วงนิดหน่อยให้เห็น loading state จริง ๆ ตอน dev */
const NETWORK_DELAY_MS = 300

export const handlers = [
  http.get('/api/stores/:slug', async ({ params }) => {
    await delay(NETWORK_DELAY_MS)
    if (params.slug !== store.slug) {
      return HttpResponse.json({ message: 'ไม่พบร้านนี้' }, { status: 404 })
    }
    return HttpResponse.json(store)
  }),

  http.get('/api/stores/:slug/menu', async ({ params }) => {
    await delay(NETWORK_DELAY_MS)
    if (params.slug !== store.slug) {
      return HttpResponse.json({ message: 'ไม่พบร้านนี้' }, { status: 404 })
    }
    return HttpResponse.json(menu)
  }),
]
