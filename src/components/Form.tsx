'use client';

import {
  createContext,
  forwardRef,
  useContext,
  useId,
  useRef,
  type FormHTMLAttributes,
  type HTMLAttributes,
  type LabelHTMLAttributes,
  type ReactElement,
  type ReactNode,
  cloneElement,
  isValidElement,
} from 'react';
import { cn } from '../utils/cn';
import { AlertCircleIcon } from './icons';

/* ---------------------------------------------------------------- Contexts */

interface FormFieldContextValue {
  name: string;
  id: string;
  errorId: string;
  descriptionId: string;
}

const FormFieldContext = createContext<FormFieldContextValue | null>(null);

export function useFormField() {
  const ctx = useContext(FormFieldContext);
  if (!ctx) {
    throw new Error('useFormField must be used inside a <FormField>.');
  }
  return ctx;
}

/* ---------------------------------------------------------------- Form */

export interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  /** Automatically focus the first invalid field when form submission fails. @default true */
  autoFocusError?: boolean;
}

export const Form = forwardRef<HTMLFormElement, FormProps>(function Form(
  { autoFocusError = true, onSubmit, className, children, ...props },
  ref
) {
  const localRef = useRef<HTMLFormElement | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (onSubmit) {
      onSubmit(e);
    }
    if (autoFocusError && e.isDefaultPrevented()) {
      const formEl = localRef.current;
      if (formEl) {
        const invalidEl = formEl.querySelector<HTMLElement>(
          '[aria-invalid="true"], :invalid'
        );
        invalidEl?.focus();
      }
    }
  };

  return (
    <form
      ref={(node) => {
        localRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLFormElement | null>).current = node;
      }}
      className={cn('pui-form', className)}
      onSubmit={handleSubmit}
      {...props}
    >
      {children}
    </form>
  );
});

/* ---------------------------------------------------------------- FormField */

export interface FormFieldRenderProps {
  field: {
    name: string;
    id: string;
    'aria-describedby': string;
    'aria-invalid': boolean;
  };
  fieldState: {
    invalid: boolean;
    error?: ReactNode;
  };
}

export interface FormFieldProps {
  name: string;
  error?: ReactNode;
  hint?: ReactNode;
  children?: ReactNode | ((props: FormFieldRenderProps) => ReactNode);
  render?: (props: FormFieldRenderProps) => ReactNode;
}

export function FormField({ name, error, hint, children, render }: FormFieldProps) {
  const generatedId = useId();
  const id = `pui-field-${name}-${generatedId}`;
  const errorId = `${id}-error`;
  const descriptionId = `${id}-hint`;

  const contextValue: FormFieldContextValue = {
    name,
    id,
    errorId,
    descriptionId,
  };

  const describedBy = [error ? errorId : null, hint ? descriptionId : null]
    .filter(Boolean)
    .join(' ');

  const renderProps: FormFieldRenderProps = {
    field: {
      name,
      id,
      'aria-describedby': describedBy,
      'aria-invalid': Boolean(error),
    },
    fieldState: {
      invalid: Boolean(error),
      error,
    },
  };

  return (
    <FormFieldContext.Provider value={contextValue}>
      {render
        ? render(renderProps)
        : typeof children === 'function'
        ? children(renderProps)
        : children}
    </FormFieldContext.Provider>
  );
}

/* ---------------------------------------------------------------- FormItem */

export interface FormItemProps extends HTMLAttributes<HTMLDivElement> {
  error?: ReactNode;
}

export const FormItem = forwardRef<HTMLDivElement, FormItemProps>(function FormItem(
  { error, className, children, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn('pui-field', className)}
      data-invalid={error ? '' : undefined}
      {...props}
    >
      {children}
    </div>
  );
});

/* ---------------------------------------------------------------- FormLabel */

export interface FormLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const FormLabel = forwardRef<HTMLLabelElement, FormLabelProps>(function FormLabel(
  { required, className, children, htmlFor, ...props },
  ref
) {
  const { id } = useFormField();

  return (
    <label
      ref={ref}
      htmlFor={htmlFor ?? id}
      className={cn('pui-label', className)}
      {...props}
    >
      {children}
      {required && (
        <>
          <span className="pui-label__req" aria-hidden="true">
            *
          </span>
          <span className="pui-sr-only">(required)</span>
        </>
      )}
    </label>
  );
});

/* ---------------------------------------------------------------- FormControl */

export interface FormControlProps {
  children: ReactElement<any>;
}

export function FormControl({ children }: FormControlProps) {
  const { id, errorId, descriptionId } = useFormField();

  if (!isValidElement(children)) return children;

  const child = children as ReactElement<{ id?: string; 'aria-describedby'?: string }>;
  const existingDescribedBy = child.props['aria-describedby'];
  const describedBy = [existingDescribedBy, errorId, descriptionId]
    .filter(Boolean)
    .join(' ');

  return cloneElement(child, {
    id: child.props.id ?? id,
    'aria-describedby': describedBy || undefined,
  });
}

/* ---------------------------------------------------------------- FormDescription */

export const FormDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(function FormDescription({ className, children, id: providedId, ...props }, ref) {
  const { descriptionId } = useFormField();

  return (
    <p
      ref={ref}
      id={providedId ?? descriptionId}
      className={cn('pui-hint', className)}
      {...props}
    >
      {children}
    </p>
  );
});

/* ---------------------------------------------------------------- FormMessage */

export interface FormMessageProps extends HTMLAttributes<HTMLParagraphElement> {
  error?: ReactNode;
}

export const FormMessage = forwardRef<HTMLParagraphElement, FormMessageProps>(
  function FormMessage({ error, className, children, id: providedId, ...props }, ref) {
    const { errorId } = useFormField();
    const content = error ?? children;

    if (!content) return null;

    return (
      <p
        ref={ref}
        id={providedId ?? errorId}
        role="alert"
        className={cn('pui-error', className)}
        {...props}
      >
        <AlertCircleIcon />
        <span>{content}</span>
      </p>
    );
  }
);
