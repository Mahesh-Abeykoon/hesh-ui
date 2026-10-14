import { useEffect, useState } from 'react';

/**
 * React hook that returns a debounced version of any value.
 *
 * @param value - The fast-changing value (e.g. search input text)
 * @param delay - Debounce duration in milliseconds (default: 300ms)
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
