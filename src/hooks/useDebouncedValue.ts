import { useEffect, useState } from 'react'

/** หน่วงค่าไว้ก่อนส่งต่อ ใช้กับช่องค้นหาเพื่อไม่ให้ filter ทุกตัวอักษร */
export function useDebouncedValue<T>(value: T, delayMs = 200): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(timer)
  }, [value, delayMs])

  return debounced
}
