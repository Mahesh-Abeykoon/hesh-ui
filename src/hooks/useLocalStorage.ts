import { useCallback, useEffect, useState } from 'react';

/**
 * SSR-safe, reactive localStorage hook with cross-tab sync and JSON serialization.
 *
 * @param key - The localStorage storage key
 * @param initialValue - Fallback value if no stored value exists
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // Read stored value or fall back to initialValue
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`[hesh-ui] Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [key, initialValue]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Set value function
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      if (typeof window === 'undefined') {
        console.warn(`[hesh-ui] Tried setting localStorage key "${key}" during SSR`);
        return;
      }

      try {
        const newValue = value instanceof Function ? value(storedValue) : value;
        window.localStorage.setItem(key, JSON.stringify(newValue));
        setStoredValue(newValue);

        // Dispatch a custom storage event so other components in the same tab update
        window.dispatchEvent(
          new StorageEvent('storage', {
            key,
            newValue: JSON.stringify(newValue),
          })
        );
      } catch (error) {
        console.warn(`[hesh-ui] Error writing localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Remove value function
  const removeValue = useCallback(() => {
    if (typeof window === 'undefined') return;

    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
      window.dispatchEvent(
        new StorageEvent('storage', {
          key,
          newValue: null,
        })
      );
    } catch (error) {
      console.warn(`[hesh-ui] Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Sync across tabs & windows via 'storage' event
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key) {
        setStoredValue(readValue());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, readValue]);

  return [storedValue, setValue, removeValue];
}
