'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { cn } from '../utils/cn';
import { Portal } from './Portal';
import {
  AlertCircleIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  InfoIcon,
  XIcon,
} from './icons';

export type ToastTone = 'info' | 'success' | 'warning' | 'danger';

export interface ToastOptions {
  title: ReactNode;
  description?: ReactNode;
  tone?: ToastTone;
  /** Milliseconds before auto-dismiss. Pass 0 to keep it open. */
  duration?: number;
  action?: ReactNode;
}

export type ToastInput = ReactNode | ToastOptions;

export interface ToastPromiseOptions<T> {
  loading: ReactNode | ToastOptions;
  success: ReactNode | ToastOptions | ((data: T) => ReactNode | ToastOptions);
  error: ReactNode | ToastOptions | ((err: unknown) => ReactNode | ToastOptions);
}

export interface ToastFunction {
  (input: ToastInput): number;
  info: (input: ToastInput, description?: ReactNode) => number;
  success: (input: ToastInput, description?: ReactNode) => number;
  warning: (input: ToastInput, description?: ReactNode) => number;
  danger: (input: ToastInput, description?: ReactNode) => number;
  error: (input: ToastInput, description?: ReactNode) => number;
  dismiss: (id: number) => void;
  update: (id: number, options: Partial<ToastOptions>) => void;
  promise: <T>(
    promise: Promise<T> | (() => Promise<T>),
    options: ToastPromiseOptions<T>
  ) => Promise<T>;
}

export interface ToastContextValue {
  toast: ToastFunction;
  dismiss: (id: number) => void;
}

interface ToastRecord extends ToastOptions {
  id: number;
  leaving?: boolean;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const TONE_ICONS: Record<ToastTone, typeof InfoIcon> = {
  info: InfoIcon,
  success: CheckCircleIcon,
  warning: AlertTriangleIcon,
  danger: AlertCircleIcon,
};

export type ToastPlacement = 'bottom-right' | 'top-right' | 'bottom-left' | 'top-center';

export interface ToastProviderProps {
  children: ReactNode;
  placement?: ToastPlacement;
  /** Default lifetime for toasts that do not specify one. */
  duration?: number;
  /** Maximum simultaneous toasts; oldest are dropped first. */
  limit?: number;
}

function isToastOptions(input: unknown): input is ToastOptions {
  return typeof input === 'object' && input !== null && 'title' in input;
}

function normalizeInput(
  input: ToastInput,
  defaultTone: ToastTone = 'info',
  description?: ReactNode
): ToastOptions {
  if (isToastOptions(input)) {
    return {
      tone: defaultTone,
      ...input,
      description: description ?? input.description,
    };
  }
  return {
    title: input as ReactNode,
    description,
    tone: defaultTone,
  };
}

let activeToastFn: ToastFunction | null = null;
let activeDismissFn: ((id: number) => void) | null = null;

/**
 * Imperative standalone toast dispatcher.
 * Can be used anywhere, including outside React components (e.g., API clients, event listeners).
 */
export const toast: ToastFunction = Object.assign(
  (input: ToastInput) => {
    if (activeToastFn) return activeToastFn(input);
    console.warn('[hesh-ui] toast() was called before <ToastProvider> was mounted.');
    return -1;
  },
  {
    info: (input: ToastInput, desc?: ReactNode) =>
      activeToastFn ? activeToastFn.info(input, desc) : -1,
    success: (input: ToastInput, desc?: ReactNode) =>
      activeToastFn ? activeToastFn.success(input, desc) : -1,
    warning: (input: ToastInput, desc?: ReactNode) =>
      activeToastFn ? activeToastFn.warning(input, desc) : -1,
    danger: (input: ToastInput, desc?: ReactNode) =>
      activeToastFn ? activeToastFn.danger(input, desc) : -1,
    error: (input: ToastInput, desc?: ReactNode) =>
      activeToastFn ? activeToastFn.error(input, desc) : -1,
    dismiss: (id: number) => {
      if (activeDismissFn) activeDismissFn(id);
    },
    update: (id: number, options: Partial<ToastOptions>) => {
      if (activeToastFn) activeToastFn.update(id, options);
    },
    promise: <T,>(
      promise: Promise<T> | (() => Promise<T>),
      options: ToastPromiseOptions<T>
    ): Promise<T> => {
      if (activeToastFn) return activeToastFn.promise(promise, options);
      return typeof promise === 'function' ? promise() : promise;
    },
  }
);

/**
 * Toast host. Mount once near the root; call `useToast().toast()` or `toast.success()` anywhere.
 *
 * The live region is `role="status"` / `aria-live="polite"`, so messages are
 * announced without stealing focus. Interruptive tones switch to
 * `aria-live="assertive"` because dropping them silently would be worse.
 */
export function ToastProvider({
  children,
  placement = 'bottom-right',
  duration = 4500,
  limit = 3,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const nextId = useRef(1);
  const timers = useRef(new Map<number, number>());

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
    window.setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 180);

    const timer = timers.current.get(id);
    if (timer) {
      window.clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const update = useCallback(
    (id: number, updates: Partial<ToastOptions>) => {
      setToasts((prev) =>
        prev.map((t) => {
          if (t.id !== id) return t;
          return { ...t, ...updates, leaving: false };
        })
      );

      if (updates.duration !== undefined) {
        const oldTimer = timers.current.get(id);
        if (oldTimer) window.clearTimeout(oldTimer);
        if (updates.duration > 0) {
          timers.current.set(id, window.setTimeout(() => dismiss(id), updates.duration));
        } else {
          timers.current.delete(id);
        }
      }
    },
    [dismiss]
  );

  const triggerToast = useCallback(
    (options: ToastOptions) => {
      const id = nextId.current;
      nextId.current += 1;

      setToasts((prev) => [...prev, { ...options, id }].slice(-limit));

      const lifetime = options.duration ?? duration;
      if (lifetime > 0) {
        timers.current.set(id, window.setTimeout(() => dismiss(id), lifetime));
      }
      return id;
    },
    [duration, dismiss, limit]
  );

  const promiseFn = useCallback(
    <T,>(
      promiseOrFn: Promise<T> | (() => Promise<T>),
      promiseOptions: ToastPromiseOptions<T>
    ): Promise<T> => {
      const loadingOpts = normalizeInput(promiseOptions.loading, 'info');
      const id = triggerToast({ ...loadingOpts, duration: loadingOpts.duration ?? 0 });

      const p = typeof promiseOrFn === 'function' ? promiseOrFn() : promiseOrFn;

      return p
        .then((data) => {
          const rawSuccess =
            typeof promiseOptions.success === 'function'
              ? promiseOptions.success(data)
              : promiseOptions.success;
          const successOpts = normalizeInput(rawSuccess, 'success');
          update(id, {
            ...successOpts,
            duration: successOpts.duration ?? duration,
          });
          return data;
        })
        .catch((err) => {
          const rawError =
            typeof promiseOptions.error === 'function'
              ? promiseOptions.error(err)
              : promiseOptions.error;
          const errorOpts = normalizeInput(rawError, 'danger');
          update(id, {
            ...errorOpts,
            duration: errorOpts.duration ?? duration,
          });
          throw err;
        });
    },
    [triggerToast, update, duration]
  );

  const toastObj = useMemo<ToastFunction>(() => {
    return Object.assign(
      (input: ToastInput) => triggerToast(normalizeInput(input)),
      {
        info: (input: ToastInput, desc?: ReactNode) =>
          triggerToast(normalizeInput(input, 'info', desc)),
        success: (input: ToastInput, desc?: ReactNode) =>
          triggerToast(normalizeInput(input, 'success', desc)),
        warning: (input: ToastInput, desc?: ReactNode) =>
          triggerToast(normalizeInput(input, 'warning', desc)),
        danger: (input: ToastInput, desc?: ReactNode) =>
          triggerToast(normalizeInput(input, 'danger', desc)),
        error: (input: ToastInput, desc?: ReactNode) =>
          triggerToast(normalizeInput(input, 'danger', desc)),
        dismiss,
        update,
        promise: promiseFn,
      }
    );
  }, [triggerToast, dismiss, update, promiseFn]);

  useEffect(() => {
    activeToastFn = toastObj;
    activeDismissFn = dismiss;
    return () => {
      if (activeToastFn === toastObj) {
        activeToastFn = null;
        activeDismissFn = null;
      }
    };
  }, [toastObj, dismiss]);

  const value = useMemo(() => ({ toast: toastObj, dismiss }), [toastObj, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Portal>
        <div
          className={cn('pui-toaster', `pui-toaster--${placement}`)}
          role="region"
          aria-label="Notifications"
        >
          {toasts.map((record) => {
            const IconComponent = TONE_ICONS[record.tone ?? 'info'];
            const assertive = record.tone === 'danger' || record.tone === 'warning';
            return (
              <div
                key={record.id}
                role={assertive ? 'alert' : 'status'}
                aria-live={assertive ? 'assertive' : 'polite'}
                aria-atomic="true"
                className={cn(
                  'pui-toast',
                  `pui-toast--${record.tone ?? 'info'}`,
                  record.leaving && 'pui-toast--leaving'
                )}
              >
                <span className="pui-toast__icon">
                  <IconComponent />
                </span>
                <div className="pui-toast__body">
                  <div className="pui-toast__title">{record.title}</div>
                  {record.description && (
                    <div className="pui-toast__desc">{record.description}</div>
                  )}
                  {record.action && (
                    <div style={{ marginTop: 'var(--pui-space-2)' }}>{record.action}</div>
                  )}
                </div>
                <button
                  type="button"
                  className="pui-toast__close"
                  aria-label="Dismiss notification"
                  onClick={() => dismiss(record.id)}
                >
                  <XIcon size="1rem" />
                </button>
              </div>
            );
          })}
        </div>
      </Portal>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast() must be used inside <ToastProvider>.');
  }
  return context;
}
