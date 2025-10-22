import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // MAC SAFARI FIX: Guard for SSR and Safari compatibility
    if (typeof window === 'undefined') return;
    
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // MAC SAFARI FIX: Null check for matchMedia result
    if (!mql) {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
      return;
    }
    
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // MAC SAFARI FIX: Strict function-type detection to prevent crashes
    // Some Safari builds have addEventListener property that's not callable
    const supportsAddEventListener = typeof mql.addEventListener === "function";
    const supportsAddListener = typeof mql.addListener === "function";
    const supportsOnChange = "onchange" in mql;

    let cleanup: (() => void) | null = null;
    
    try {
      if (supportsAddEventListener) {
        // Modern browsers (Safari 14+, Chrome, Firefox, Opera)
        mql.addEventListener("change", onChange);
        cleanup = () => {
          if (typeof mql.removeEventListener === "function") {
            mql.removeEventListener("change", onChange);
          }
        };
      } else if (supportsAddListener) {
        // Legacy Safari (Safari 13 and older)
        mql.addListener(onChange);
        cleanup = () => {
          if (typeof mql.removeListener === "function") {
            mql.removeListener(onChange);
          }
        };
      } else if (supportsOnChange) {
        // Older Safari fallback using onchange property
        (mql as any).onchange = onChange;
        cleanup = () => {
          try { (mql as any).onchange = null; } catch {}
        };
      } else {
        // Universal fallback for all browsers
        window.addEventListener("resize", onChange);
        cleanup = () => window.removeEventListener("resize", onChange);
      }
    } catch (err) {
      // MAC SAFARI FIX: If any method fails, use window.resize as fallback
      console.warn("MediaQueryList listener failed, using window.resize fallback", err);
      window.addEventListener("resize", onChange);
      cleanup = () => window.removeEventListener("resize", onChange);
    }

    // Set initial value
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

    // Return cleanup function
    return () => { if (cleanup) cleanup(); };
  }, [])

  return !!isMobile
}
