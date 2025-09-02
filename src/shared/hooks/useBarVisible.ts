import { useEffect, useRef, useState } from 'react'

export function useBarVisible() {
  const sentryRef = useRef<HTMLDivElement | null>(null)
  const [isVisible, setVisible] = useState(true)

  useEffect(() => {
    const el = sentryRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return

    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return { sentryRef, isVisible }
}
