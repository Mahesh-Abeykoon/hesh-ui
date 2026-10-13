import type { HTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'block' | 'text' | 'circle';
  width?: number | string;
  height?: number | string;
  /** Renders N stacked lines — handy for text placeholders. */
  lines?: number;
}

function SkeletonRoot({ variant = 'block', width, height, lines, className, style, ...props }: SkeletonProps) {
  if (lines && lines > 1) {
    return (
      <span className={cn('pui-field', className)} style={{ gap: 'var(--pui-space-2)' }} {...props}>
        {Array.from({ length: lines }, (_, index) => (
          <SkeletonRoot
            key={index}
            variant="text"
            width={index === lines - 1 ? '62%' : width ?? '100%'}
          />
        ))}
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      className={cn(
        'pui-skeleton',
        variant === 'text' && 'pui-skeleton--text',
        variant === 'circle' && 'pui-skeleton--circle',
        className
      )}
      style={{ width, height, ...style }}
      {...props}
    />
  );
}

export interface SkeletonAvatarProps extends HTMLAttributes<HTMLSpanElement> {
  size?: number | string;
}

export function SkeletonAvatar({ size = 40, className, style, ...props }: SkeletonAvatarProps) {
  return (
    <SkeletonRoot
      variant="circle"
      width={size}
      height={size}
      className={className}
      style={style}
      {...props}
    />
  );
}

export interface SkeletonTextProps extends HTMLAttributes<HTMLSpanElement> {
  lines?: number;
  width?: number | string;
}

export function SkeletonText({ lines = 3, width = '100%', className, ...props }: SkeletonTextProps) {
  return (
    <SkeletonRoot
      lines={lines}
      width={width}
      className={className}
      {...props}
    />
  );
}

export interface SkeletonCardProps extends HTMLAttributes<HTMLDivElement> {
  hasImage?: boolean;
  lines?: number;
}

export function SkeletonCard({ hasImage = true, lines = 3, className, ...props }: SkeletonCardProps) {
  return (
    <div
      className={cn('pui-card pui-card--pad', className)}
      style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}
      {...props}
    >
      {hasImage && (
        <SkeletonRoot
          variant="block"
          style={{ width: '100%', height: '140px', borderRadius: 'var(--pui-radius-md)' }}
        />
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <SkeletonAvatar size={36} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
          <SkeletonRoot variant="text" width="55%" height="0.875rem" />
          <SkeletonRoot variant="text" width="35%" height="0.75rem" />
        </div>
      </div>
      <SkeletonText lines={lines} />
    </div>
  );
}

export interface SkeletonTableProps extends HTMLAttributes<HTMLDivElement> {
  rows?: number;
  columns?: number;
}

export function SkeletonTable({ rows = 4, columns = 4, className, ...props }: SkeletonTableProps) {
  return (
    <div
      className={cn('pui-card', className)}
      style={{ overflow: 'hidden', width: '100%' }}
      {...props}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: '1rem',
          padding: '0.875rem 1rem',
          borderBottom: '1px solid var(--pui-border)',
          background: 'var(--pui-surface-subtle)',
        }}
      >
        {Array.from({ length: columns }, (_, i) => (
          <SkeletonRoot key={i} variant="text" width={`${50 + (i % 3) * 15}%`} height="0.875rem" />
        ))}
      </div>
      {Array.from({ length: rows }, (_, r) => (
        <div
          key={r}
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: '1rem',
            padding: '0.875rem 1rem',
            borderBottom: r === rows - 1 ? 'none' : '1px solid var(--pui-border)',
          }}
        >
          {Array.from({ length: columns }, (_, c) => (
            <SkeletonRoot key={c} variant="text" width={`${65 + ((r + c) % 4) * 8}%`} />
          ))}
        </div>
      ))}
    </div>
  );
}

export const Skeleton = Object.assign(SkeletonRoot, {
  Avatar: SkeletonAvatar,
  Text: SkeletonText,
  Card: SkeletonCard,
  Table: SkeletonTable,
});
