import { useCallback, useState } from 'react';

export interface UseClipboardOptions {
  /** Duration in milliseconds before resetting `copied` state. @default 2000 */
  timeout?: number;
}

export interface UseClipboardReturn {
  copied: boolean;
  copy: (text: string) => Promise<boolean>;
  reset: () => void;
}

/**
 * React hook to copy arbitrary text to the user's clipboard.
 * Manages transient `copied` state with configurable auto-reset.
 *
 * @param options - Hook configuration options
 */
export function useClipboard(options: UseClipboardOptions = {}): UseClipboardReturn {
  const { timeout = 2000 } = options;
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      if (typeof window === 'undefined' || !navigator?.clipboard?.writeText) {
        console.warn('[hesh-ui] Clipboard API is unavailable in this environment');
        return false;
      }

      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);

        setTimeout(() => {
          setCopied(false);
        }, timeout);

        return true;
      } catch (error) {
        console.warn('[hesh-ui] Failed to copy to clipboard:', error);
        setCopied(false);
        return false;
      }
    },
    [timeout]
  );

  const reset = useCallback(() => {
    setCopied(false);
  }, []);

  return { copied, copy, reset };
}
