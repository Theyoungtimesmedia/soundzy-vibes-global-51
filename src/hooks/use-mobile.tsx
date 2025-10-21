import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // SAFARI FIX: Guard for SSR and Safari compatibility
    if (typeof window === 'undefined') return;
    
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // SAFARI FIX: Null check for matchMedia result
    if (!mql) {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
      return;
    }
    
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // SAFARI FIX: Use addListener for older Safari, addEventListener for modern browsers
    if (mql.addEventListener) {
      mql.addEventListener("change", onChange)
    } else if (mql.addListener) {
      // Legacy Safari support
      mql.addListener(onChange)
    }
    
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    return () => {
      // SAFARI FIX: Clean up both modern and legacy listeners
      if (mql.removeEventListener) {
        mql.removeEventListener("change", onChange)
      } else if (mql.removeListener) {
        mql.removeListener(onChange)
      }
    }
  }, [])

  return !!isMobile
}
