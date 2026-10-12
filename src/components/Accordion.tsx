'use client';

import React, {
  createContext,
  useContext,
  useId,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '../utils/cn';
import { useControllableState } from '../hooks/useControllableState';
import { ChevronDownIcon } from './icons';

export interface AccordionItem {
  id: string;
  title: ReactNode;
  content: ReactNode;
  /** Sub-caption displayed beneath title. */
  subtitle?: ReactNode;
  /** Leading icon indicator. */
  icon?: ReactNode;
  /** Trailing tag or status badge. */
  badge?: ReactNode;
  disabled?: boolean;
}

export interface AccordionProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Optional array of items for config-driven rendering. */
  items?: AccordionItem[];
  /** Controlled or uncontrolled list of open item ids. */
  open?: string[];
  defaultOpen?: string[];
  onOpenChange?: (open: string[]) => void;
  /** Allow more than one panel open simultaneously. @default false */
  multiple?: boolean;
  /** Visual presentation style. @default 'default' */
  variant?: 'default' | 'bordered' | 'separated' | 'pills';
  /** Size scale of trigger padding and typography. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: ReactNode;
}

interface AccordionContextValue {
  isOpen: (id: string) => boolean;
  toggle: (id: string) => void;
  baseId: string;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

export function useAccordionContext() {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error('Accordion components must be used inside <Accordion>.');
  return ctx;
}

interface AccordionItemContextValue {
  value: string;
  disabled?: boolean;
}

const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);

/* ---------------------------------------------------------------- Compound Components */

export interface AccordionItemComponentProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  disabled?: boolean;
  children: ReactNode;
}

export function AccordionItemComponent({
  value,
  disabled,
  className,
  children,
  ...props
}: AccordionItemComponentProps) {
  const { isOpen } = useAccordionContext();
  const open = isOpen(value);

  return (
    <AccordionItemContext.Provider value={{ value, disabled }}>
      <div
        className={cn('pui-accordion__item', open && 'pui-accordion__item--open', className)}
        {...props}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

export interface AccordionTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  subtitle?: ReactNode;
  icon?: ReactNode;
  badge?: ReactNode;
  children: ReactNode;
}

export function AccordionTrigger({
  subtitle,
  icon,
  badge,
  className,
  children,
  ...props
}: AccordionTriggerProps) {
  const { isOpen, toggle, baseId } = useAccordionContext();
  const itemCtx = useContext(AccordionItemContext);
  const id = itemCtx?.value ?? '';
  const disabled = props.disabled ?? itemCtx?.disabled;
  const open = isOpen(id);

  return (
    <h3 style={{ margin: 0 }}>
      <button
        type="button"
        className={cn('pui-accordion__trigger', className)}
        aria-expanded={open}
        aria-controls={`${baseId}-panel-${id}`}
        id={`${baseId}-trigger-${id}`}
        disabled={disabled}
        onClick={() => toggle(id)}
        {...props}
      >
        {icon && <span className="pui-accordion__icon">{icon}</span>}
        <div className="pui-accordion__text-wrap">
          <span className="pui-accordion__title">{children}</span>
          {subtitle && <span className="pui-accordion__subtitle">{subtitle}</span>}
        </div>
        {badge && <span className="pui-accordion__badge">{badge}</span>}
        <span className="pui-accordion__trigger-icon" aria-hidden="true">
          <ChevronDownIcon />
        </span>
      </button>
    </h3>
  );
}

export interface AccordionContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function AccordionContent({ className, children, ...props }: AccordionContentProps) {
  const { isOpen, baseId } = useAccordionContext();
  const itemCtx = useContext(AccordionItemContext);
  const id = itemCtx?.value ?? '';
  const open = isOpen(id);

  if (!open) return null;

  return (
    <div
      id={`${baseId}-panel-${id}`}
      role="region"
      aria-labelledby={`${baseId}-trigger-${id}`}
      className={cn('pui-accordion__panel', className)}
      {...props}
    >
      <div className="pui-accordion__panel-inner">{children}</div>
    </div>
  );
}

/* ---------------------------------------------------------------- Main Accordion */

export function Accordion({
  items,
  open,
  defaultOpen = [],
  onOpenChange,
  multiple = false,
  variant = 'default',
  size = 'md',
  className,
  children,
  ...props
}: AccordionProps) {
  const [state, setState] = useControllableState<string[]>({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const toggle = (id: string) => {
    setState((prev) => {
      const isOpen = prev.includes(id);
      if (multiple) return isOpen ? prev.filter((v) => v !== id) : [...prev, id];
      return isOpen ? [] : [id];
    });
  };

  const baseId = useId();

  const contextValue: AccordionContextValue = {
    isOpen: (id: string) => state.includes(id),
    toggle,
    baseId,
  };

  return (
    <AccordionContext.Provider value={contextValue}>
      <div
        className={cn(
          'pui-accordion',
          `pui-accordion--${variant}`,
          `pui-accordion--${size}`,
          className
        )}
        {...props}
      >
        {items ? (
          items.map((item) => {
            const isOpen = state.includes(item.id);
            return (
              <div
                key={item.id}
                className={cn('pui-accordion__item', isOpen && 'pui-accordion__item--open')}
              >
                <h3 style={{ margin: 0 }}>
                  <button
                    type="button"
                    className="pui-accordion__trigger"
                    aria-expanded={isOpen}
                    aria-controls={`${baseId}-panel-${item.id}`}
                    id={`${baseId}-trigger-${item.id}`}
                    disabled={item.disabled}
                    onClick={() => toggle(item.id)}
                  >
                    {item.icon && <span className="pui-accordion__icon">{item.icon}</span>}
                    <div className="pui-accordion__text-wrap">
                      <span className="pui-accordion__title">{item.title}</span>
                      {item.subtitle && (
                        <span className="pui-accordion__subtitle">{item.subtitle}</span>
                      )}
                    </div>
                    {item.badge && <span className="pui-accordion__badge">{item.badge}</span>}
                    <span className="pui-accordion__trigger-icon" aria-hidden="true">
                      <ChevronDownIcon />
                    </span>
                  </button>
                </h3>
                {isOpen && (
                  <div
                    id={`${baseId}-panel-${item.id}`}
                    role="region"
                    aria-labelledby={`${baseId}-trigger-${item.id}`}
                    className="pui-accordion__panel"
                  >
                    <div className="pui-accordion__panel-inner">{item.content}</div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          children
        )}
      </div>
    </AccordionContext.Provider>
  );
}

Accordion.Item = AccordionItemComponent;
Accordion.Trigger = AccordionTrigger;
Accordion.Content = AccordionContent;
