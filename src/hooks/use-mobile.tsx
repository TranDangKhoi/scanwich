import { useEffect, useState } from "react";
import debounce from "lodash/debounce";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const handleChange = debounce((e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches);
    }, 200);

    // Initial check
    handleChange(mql);

    // Add listener for changes
    mql.addEventListener("change", handleChange);

    return () => {
      handleChange.cancel();
      mql.removeEventListener("change", handleChange);
    };
  }, []);

  return !!isMobile;
}
