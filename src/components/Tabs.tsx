'use client';

import {
  createContext,
  useCallback,
  useContext,
  useId,
  useRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cn } from '../utils/cn';
import { useControllableState } from '../hooks/useControllableState';

export interface TabItem {
  value: string;
  label: ReactNode;
  content?: ReactNode;
  disabled?: boolean;
  /** Small trailing pill, e.g. an unread count. */
  count?: number | string;
  icon?: ReactNode;
}

export type TabsVariant = 'line' | 'pills' | 'boxed';
export type TabsSize = 'sm' | 'md' | 'lg';

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Optional array of tab items for config-driven rendering. */
  items?: readonly TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
  variant?: TabsVariant;
  size?: TabsSize;
  fullWidth?: boolean;
  /** Skip rendering inactive panels. Use for expensive or stateful content. */
  lazy?: boolean;
  children?: ReactNode;
}

interface TabsContextValue {
  value: string;
  select: (value: string) => void;
  baseId: string;
  registerRef: (value: string, node: HTMLButtonElement | null) => void;
  registeredValues: string[];
  registerValue: (value: string) => void;
  unregisterValue: (value: string) => void;
  orientation: 'horizontal' | 'vertical';
  variant: TabsVariant;
  size: TabsSize;
  fullWidth: boolean;
  lazy: boolean;
}

const TabsContext = createContext<TabsContextValue | null>(null);

export function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) throw new Error('Tab components must be used inside <Tabs>.');
  return context;
}

/* ---------------------------------------------------------------- Compound Components */

export interface TabsListProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function TabsList({ className, children, ...props }: TabsListProps) {
  const { orientation, variant, registeredValues, value, select } = useTabsContext();
  const listRef = useRef<HTMLDivElement>(null);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (registeredValues.length === 0) return;

    const currentIndex = registeredValues.indexOf(value);
    const nextKey = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';
    const prevKey = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';

    let target: string | undefined;

    if (event.key === nextKey) {
      target = registeredValues[(currentIndex + 1) % registeredValues.length];
    } else if (event.key === prevKey) {
      target = registeredValues[(currentIndex - 1 + registeredValues.length) % registeredValues.length];
    } else if (event.key === 'Home') {
      target = registeredValues[0];
    } else if (event.key === 'End') {
      target = registeredValues[registeredValues.length - 1];
    }

    if (target) {
      event.preventDefault();
      select(target);
      const targetBtn = listRef.current?.querySelector<HTMLButtonElement>(`[data-tab-value="${target}"]`);
      targetBtn?.focus();
    }
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-orientation={orientation}
      className={cn('pui-tabs__list', `pui-tabs__list--${variant}`, className)}
      onKeyDown={onKeyDown}
      {...props}
    >
      {children}
    </div>
  );
}

export interface TabsTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  icon?: ReactNode;
  count?: number | string;
  children?: ReactNode;
}

export function TabsTrigger({
  value,
  icon,
  count,
  className,
  disabled,
  children,
  ...props
}: TabsTriggerProps) {
  const { value: selected, select, baseId, registerRef, registerValue, unregisterValue, variant, size, fullWidth } =
    useTabsContext();

  const isActive = selected === value;

  return (
    <button
      ref={(node) => {
        registerRef(value, node);
        if (node) registerValue(value);
        else unregisterValue(value);
      }}
      type="button"
      role="tab"
      id={`${baseId}-tab-${value}`}
      data-tab-value={value}
      aria-selected={isActive}
      aria-controls={`${baseId}-panel-${value}`}
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      className={cn(
        'pui-tab',
        `pui-tab--${variant}`,
        `pui-tab--${size}`,
        fullWidth && 'pui-tab--full-width',
        className
      )}
      onClick={() => select(value)}
      {...props}
    >
      {icon && <span className="pui-btn__icon">{icon}</span>}
      {children}
      {count !== undefined && <span className="pui-tab__count">{count}</span>}
    </button>
  );
}

export interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  children?: ReactNode;
}

export function TabsContent({ value, className, children, ...props }: TabsContentProps) {
  const { value: selected, baseId, lazy } = useTabsContext();
  const isActive = selected === value;

  if (lazy && !isActive) return null;

  return (
    <div
      role="tabpanel"
      id={`${baseId}-panel-${value}`}
      aria-labelledby={`${baseId}-tab-${value}`}
      hidden={!isActive}
      tabIndex={0}
      className={cn('pui-tabs__panel', className)}
      {...props}
    >
      {children}
    </div>
  );
}

/* ---------------------------------------------------------------- Main Tabs */

export function Tabs({
  items,
  value,
  defaultValue,
  onValueChange,
  orientation = 'horizontal',
  variant = 'line',
  size = 'md',
  fullWidth = false,
  lazy = false,
  className,
  children,
  ...props
}: TabsProps) {
  const initialValue = defaultValue ?? (items && items[0] ? items[0].value : '');
  const [selected, setSelected] = useControllableState<string>({
    value,
    defaultValue: initialValue,
    onChange: onValueChange,
  });

  const baseId = useId();
  const refs = useRef(new Map<string, HTMLButtonElement | null>());
  const registeredValuesRef = useRef<string[]>([]);

  const registerRef = useCallback((tabValue: string, node: HTMLButtonElement | null) => {
    if (node) refs.current.set(tabValue, node);
    else refs.current.delete(tabValue);
  }, []);

  const registerValue = useCallback((tabValue: string) => {
    if (!registeredValuesRef.current.includes(tabValue)) {
      registeredValuesRef.current.push(tabValue);
    }
  }, []);

  const unregisterValue = useCallback((tabValue: string) => {
    registeredValuesRef.current = registeredValuesRef.current.filter((v) => v !== tabValue);
  }, []);

  const select = useCallback(
    (next: string) => {
      if (items?.find((item) => item.value === next)?.disabled) return;
      setSelected(next);
    },
    [items, setSelected]
  );

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!items) return;
    const enabled = items.filter((item) => !item.disabled);
    if (enabled.length === 0) return;

    const currentIndex = enabled.findIndex((item) => item.value === selected);
    const nextKey = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';
    const prevKey = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';

    let target: string | undefined;

    if (event.key === nextKey) {
      target = enabled[(currentIndex + 1) % enabled.length]?.value;
    } else if (event.key === prevKey) {
      target = enabled[(currentIndex - 1 + enabled.length) % enabled.length]?.value;
    } else if (event.key === 'Home') {
      target = enabled[0]?.value;
    } else if (event.key === 'End') {
      target = enabled[enabled.length - 1]?.value;
    }

    if (target) {
      event.preventDefault();
      select(target);
      refs.current.get(target)?.focus();
    }
  };

  const contextValue: TabsContextValue = {
    value: selected,
    select,
    baseId,
    registerRef,
    registeredValues: registeredValuesRef.current,
    registerValue,
    unregisterValue,
    orientation,
    variant,
    size,
    fullWidth,
    lazy,
  };

  return (
    <TabsContext.Provider value={contextValue}>
      <div
        className={cn(
          'pui-tabs',
          orientation === 'vertical' && 'pui-tabs--vertical',
          `pui-tabs--${variant}`,
          `pui-tabs--${size}`,
          fullWidth && 'pui-tabs--full-width',
          className
        )}
        {...props}
      >
        {items ? (
          <>
            <div
              role="tablist"
              aria-orientation={orientation}
              className={cn('pui-tabs__list', `pui-tabs__list--${variant}`)}
              onKeyDown={onKeyDown}
            >
              {items.map((item) => {
                const isActive = item.value === selected;
                return (
                  <button
                    key={item.value}
                    ref={(node) => registerRef(item.value, node)}
                    type="button"
                    role="tab"
                    id={`${baseId}-tab-${item.value}`}
                    aria-selected={isActive}
                    aria-controls={`${baseId}-panel-${item.value}`}
                    tabIndex={isActive ? 0 : -1}
                    disabled={item.disabled}
                    className={cn(
                      'pui-tab',
                      `pui-tab--${variant}`,
                      `pui-tab--${size}`,
                      fullWidth && 'pui-tab--full-width'
                    )}
                    onClick={() => select(item.value)}
                  >
                    {item.icon && <span className="pui-btn__icon">{item.icon}</span>}
                    {item.label}
                    {item.count !== undefined && <span className="pui-tab__count">{item.count}</span>}
                  </button>
                );
              })}
            </div>

            {items.map((item) => {
              const isActive = item.value === selected;
              if (lazy && !isActive) return null;
              return (
                <div
                  key={item.value}
                  role="tabpanel"
                  id={`${baseId}-panel-${item.value}`}
                  aria-labelledby={`${baseId}-tab-${item.value}`}
                  hidden={!isActive}
                  tabIndex={0}
                  className="pui-tabs__panel"
                >
                  {item.content}
                </div>
              );
            })}
          </>
        ) : (
          children
        )}
      </div>
    </TabsContext.Provider>
  );
}

Tabs.List = TabsList;
Tabs.Trigger = TabsTrigger;
Tabs.Content = TabsContent;
