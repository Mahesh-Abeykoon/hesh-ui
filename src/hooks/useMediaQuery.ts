import { useEffect, useState } from 'react';

/**
 * React hook that tracks whether a CSS media query matches.
 * Fully SSR-safe: returns false or serverFallback during server render.
 *
 * @param query - The media query string (e.g., '(max-width: 768px)' or '(prefers-color-scheme: dark)')
 * @param serverFallback - Initial value during SSR or before hydration (default: false)
 */
export function useMediaQuery(query: string, serverFallback = false): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && 'matchMedia' in window) {
      return window.matchMedia(query).matches;
    }
    return serverFallback;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !('matchMedia' in window)) {
      return;
    }

    const mediaQueryList = window.matchMedia(query);
    const updateMatch = (event: MediaQueryListEvent | MediaQueryList) => {
      setMatches(event.matches);
    };

    setMatches(mediaQueryList.matches);

    if (typeof mediaQueryList.addEventListener === 'function') {
      mediaQueryList.addEventListener('change', updateMatch);
      return () => mediaQueryList.removeEventListener('change', updateMatch);
    } else {
      // Fallback for older Safari
      mediaQueryList.addListener(updateMatch);
      return () => mediaQueryList.removeListener(updateMatch);
    }
  }, [query]);

  return matches;
}
