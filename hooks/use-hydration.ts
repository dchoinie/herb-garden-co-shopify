import { useState, useEffect } from "react";

/**
 * Hook to prevent hydration mismatches by ensuring components
 * only render after the client has mounted
 */
export function useHydration() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
