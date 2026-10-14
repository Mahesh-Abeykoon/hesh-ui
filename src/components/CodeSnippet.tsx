'use client';

import { forwardRef, useState, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../utils/cn';
import { CopyButton } from './CopyButton';

export interface CodeSnippetProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Raw code string. */
  code: string;
  /** Language identifier (e.g. 'tsx', 'bash', 'css'). */
  language?: string;
  /** Optional title shown in the header bar. */
  title?: ReactNode;
  /** Whether to show line numbers. @default false */
  showLineNumbers?: boolean;
  /** Whether to show the copy button in header. @default true */
  copyable?: boolean;
}

/**
 * CodeSnippet displays preformatted code blocks with language indicator, optional line numbers,
 * and built-in clipboard copying.
 */
const CodeSnippetRoot = forwardRef<HTMLDivElement, CodeSnippetProps>(function CodeSnippet(
  {
    code,
    language = 'bash',
    title,
    showLineNumbers = false,
    copyable = true,
    className,
    ...props
  },
  ref
) {
  const lines = code.trim().split('\n');

  return (
    <div ref={ref} className={cn('pui-code-snippet', className)} {...props}>
      <div className="pui-code-snippet__header">
        <div className="pui-code-snippet__meta">
          {title && <span className="pui-code-snippet__title">{title}</span>}
          {language && <span className="pui-code-snippet__lang">{language}</span>}
        </div>
        {copyable && <CopyButton value={code} size="sm" variant="ghost" label="Copy" />}
      </div>

      <pre className="pui-code-snippet__pre">
        <code>
          {showLineNumbers ? (
            <span className="pui-code-snippet__lines">
              {lines.map((line, i) => (
                <span key={i} className="pui-code-snippet__line">
                  <span className="pui-code-snippet__line-num">{i + 1}</span>
                  <span className="pui-code-snippet__line-text">{line}</span>
                </span>
              ))}
            </span>
          ) : (
            code
          )}
        </code>
      </pre>
    </div>
  );
});

export interface CodeTab {
  label: string;
  code: string;
  language?: string;
  icon?: ReactNode;
}

export interface CodeGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  tabs: CodeTab[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (tab: string) => void;
  showLineNumbers?: boolean;
  copyable?: boolean;
}

export const CodeGroup = forwardRef<HTMLDivElement, CodeGroupProps>(function CodeGroup(
  {
    tabs,
    defaultValue,
    value: controlledValue,
    onValueChange,
    showLineNumbers = false,
    copyable = true,
    className,
    ...props
  },
  ref
) {
  const [internalValue, setInternalValue] = useState(
    defaultValue || (tabs[0] ? tabs[0].label : '')
  );
  const activeLabel = controlledValue ?? internalValue;
  const activeTab = tabs.find((t) => t.label === activeLabel) || tabs[0];

  const handleTabChange = (label: string) => {
    setInternalValue(label);
    onValueChange?.(label);
  };

  const lines = activeTab?.code.trim().split('\n') || [];

  return (
    <div ref={ref} className={cn('pui-code-snippet pui-code-group', className)} {...props}>
      <div className="pui-code-snippet__header">
        <div className="pui-code-snippet__tabs" role="tablist">
          {tabs.map((tab) => {
            const isActive = tab.label === activeTab?.label;
            return (
              <button
                key={tab.label}
                type="button"
                role="tab"
                aria-selected={isActive}
                data-active={isActive ? 'true' : 'false'}
                className="pui-code-snippet__tab"
                onClick={() => handleTabChange(tab.label)}
              >
                {tab.icon && <span style={{ marginRight: '0.375rem' }}>{tab.icon}</span>}
                {tab.label}
              </button>
            );
          })}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {activeTab?.language && (
            <span className="pui-code-snippet__lang">{activeTab.language}</span>
          )}
          {copyable && activeTab?.code && (
            <CopyButton value={activeTab.code} size="sm" variant="ghost" label="Copy" />
          )}
        </div>
      </div>

      <pre className="pui-code-snippet__pre">
        <code>
          {showLineNumbers ? (
            <span className="pui-code-snippet__lines">
              {lines.map((line, i) => (
                <span key={i} className="pui-code-snippet__line">
                  <span className="pui-code-snippet__line-num">{i + 1}</span>
                  <span className="pui-code-snippet__line-text">{line}</span>
                </span>
              ))}
            </span>
          ) : (
            activeTab?.code
          )}
        </code>
      </pre>
    </div>
  );
});

export const CodeSnippet = Object.assign(CodeSnippetRoot, {
  Group: CodeGroup,
});
