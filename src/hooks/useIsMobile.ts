import { useState, useEffect } from 'react'

/** Single source of truth for the mobile breakpoint (px). */
export const MOBILE_BREAKPOINT = 768

const QUERY = `(max-width: ${MOBILE_BREAKPOINT}px)`

/**
 * Returns true when the viewport is at or below the mobile breakpoint.
 * Layout in this app lives in inline styles, so responsiveness is driven
 * from JS rather than CSS media queries.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.matchMedia(QUERY).matches : false
  )

  useEffect(() => {
    const mql = window.matchMedia(QUERY)
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    // Sync in case the viewport changed between initial render and mount.
    setIsMobile(mql.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return isMobile
}
