import { Badge, Button, Separator } from '../../src/index';
import { ArrowRightIcon, CheckIcon, ExternalLinkIcon } from '../../src/index';
import { DocPage, Section } from '../components/DocPage';
import { CodeBlock } from '../components/CodeBlock';

const HOOKS_SNIPPET = `import { useMediaQuery, useLocalStorage, useClipboard, useDebounce } from 'hesh-ui';

export function ResponsiveUserProfile() {
  // 1. Reactive CSS breakpoint query
  const isMobile = useMediaQuery('(max-width: 768px)');

  // 2. Cross-tab synced local storage state
  const [theme, setTheme] = useLocalStorage('hesh-theme', 'system');

  // 3. Instant clipboard copying with auto-reset
  const { copy, copied } = useClipboard({ timeout: 2000 });

  // 4. Smooth input debouncing
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  return (
    <div className="profile-card">
      <p>Viewport: {isMobile ? 'Mobile Sheet' : 'Desktop Drawer'}</p>
      <button onClick={() => copy('npm install hesh-ui')}>
        {copied ? 'Copied to Clipboard!' : 'Copy Install Command'}
      </button>
    </div>
  );
}`;

export function ChangelogPage() {
  return (
    <DocPage
      eyebrow="Release Radar"
      title="Release Notes"
      lede="Track the architectural progression, feature additions, and design system refinements of Hesh UI."
    >
      {/* High-level digest cards */}
      <div className="changelog__stats-grid">
        <div className="changelog__stat-card">
          <span className="changelog__stat-num">v1.1.0</span>
          <span className="changelog__stat-label">Current Stable Release</span>
        </div>
        <div className="changelog__stat-card">
          <span className="changelog__stat-num">+4 Hooks</span>
          <span className="changelog__stat-label">Essential Logic Suite</span>
        </div>
        <div className="changelog__stat-card">
          <span className="changelog__stat-num">+6 Blocks</span>
          <span className="changelog__stat-label">Production Page Sections</span>
        </div>
        <div className="changelog__stat-card">
          <span className="changelog__stat-num">80 Items</span>
          <span className="changelog__stat-label">Zero-Dependency Components</span>
        </div>
      </div>

      <Section title="Timeline & Releases">
        <div className="changelog__timeline">
          {/* ================================================================= v1.1.0 */}
          <div className="changelog__entry">
            <span className="changelog__entry-node" />

            <div className="changelog__entry-header">
              <div className="changelog__entry-version-row">
                <span className="changelog__entry-version">v1.1.0</span>
                <Badge tone="success" variant="subtle" dot pulse>Latest</Badge>
                <span className="changelog__entry-date">October 14, 2026</span>
              </div>
              <a
                href="https://github.com/Mahesh-Abeykoon/hesh-ui"
                target="_blank"
                rel="noreferrer"
                className="changelog__pill"
              >
                GitHub Release <ExternalLinkIcon size={12} />
              </a>
            </div>

            {/* Feature 1: Hooks Suite */}
            <div className="changelog__feature-card">
              <div className="changelog__feature-head">
                <div className="changelog__feature-title">
                  <Badge tone="primary" variant="subtle">Suite</Badge>
                  <span>Essential Hooks Suite</span>
                </div>
                <div className="changelog__pill-grid">
                  <span className="changelog__pill">useMediaQuery</span>
                  <span className="changelog__pill">useDebounce</span>
                  <span className="changelog__pill">useLocalStorage</span>
                  <span className="changelog__pill">useClipboard</span>
                </div>
              </div>

              <p className="changelog__feature-desc">
                Four production-grade, SSR-resilient React hooks built with strict TypeScript generics and zero external dependencies. Designed to handle responsive layouts, input debouncing, cross-tab synced storage, and clipboard interactions seamlessly.
              </p>

              <CodeBlock
                code={HOOKS_SNIPPET}
                language="tsx"
                filename="hooks-preview.tsx"
                copyable
                embedded
              />
            </div>

            {/* Feature 2: Production Blocks & Combobox Superpowers */}
            <div className="changelog__feature-card">
              <div className="changelog__feature-head">
                <div className="changelog__feature-title">
                  <Badge tone="info" variant="subtle">Templates</Badge>
                  <span>Production Blocks & Combobox Superpowers</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    if (typeof window !== 'undefined') window.location.hash = '#/blocks';
                  }}
                  rightIcon={<ArrowRightIcon size={14} />}
                >
                  View Blocks Gallery
                </Button>
              </div>

              <p className="changelog__feature-desc">
                Introduced 6 full-page production block compositions that pair form validation, cards, charts, and navigation patterns into ready-to-copy code:
              </p>

              <div className="changelog__pill-grid">
                <span className="changelog__pill">Hero Landing Section</span>
                <span className="changelog__pill">Authentication Form</span>
                <span className="changelog__pill">Pricing & Plan Matrix</span>
                <span className="changelog__pill">Dashboard Metrics</span>
                <span className="changelog__pill">Account Settings</span>
                <span className="changelog__pill">Onboarding Wizard</span>
              </div>

              <p className="changelog__feature-desc" style={{ marginTop: '0.25rem' }}>
                Combobox also gained <strong>creatable</strong> custom items, <strong>async search</strong> streaming with loading states, and <strong>virtualized</strong> list performance for datasets up to 10,000 options.
              </p>
            </div>

            {/* Feature 3: AST Import Cleaner & CI */}
            <div className="changelog__feature-card">
              <div className="changelog__feature-head">
                <div className="changelog__feature-title">
                  <Badge tone="warning" variant="subtle">Tooling & CI</Badge>
                  <span>Automated AST Import Cleaner & 4-Lane CI</span>
                </div>
                <Badge tone="neutral" variant="outline">package.json</Badge>
              </div>

              <p className="changelog__feature-desc">
                Never manually hunt down unused imports again. Added a TypeScript AST compiler script that traverses source code, analyzes symbol usage outside import clauses, and automatically cleans dead statements without breaking formatting or type specifiers:
              </p>

              <div className="changelog__terminal">
                <div className="changelog__terminal-line">
                  <span className="changelog__terminal-prompt">$</span>
                  <span className="changelog__terminal-cmd">npm run lint:fix</span>
                  <span className="changelog__terminal-comment"># Auto-removes unused imports across 180+ files</span>
                </div>
                <div className="changelog__terminal-line">
                  <span className="changelog__terminal-prompt">$</span>
                  <span className="changelog__terminal-cmd">npm run lint:unused</span>
                  <span className="changelog__terminal-comment"># CI gate check used in GitHub Actions</span>
                </div>
              </div>
            </div>

            {/* Feature 4: Elevation & Hero Redesign */}
            <div className="changelog__feature-card">
              <div className="changelog__feature-head">
                <div className="changelog__feature-title">
                  <Badge tone="neutral" variant="subtle">Design System</Badge>
                  <span>Refined Neutral Elevation & Full-Width Hero</span>
                </div>
              </div>

              <p className="changelog__feature-desc">
                Removed artificial 1px cyan hover outlines across cards, topbar buttons, and interactive containers. Hover states now utilize refined neutral elevation shadows and subtle border transitions. Additionally, the hero headline was redesigned to span full width alongside the flagship 96px Hesh brand mark.
              </p>
            </div>
          </div>

          {/* ================================================================= v1.0.0 */}
          <div className="changelog__entry">
            <span className="changelog__entry-node changelog__entry-node--past" />

            <div className="changelog__entry-header">
              <div className="changelog__entry-version-row">
                <span className="changelog__entry-version">v1.0.0</span>
                <Badge tone="neutral" variant="outline">Foundational Release</Badge>
                <span className="changelog__entry-date">October 2026</span>
              </div>
            </div>

            <div className="changelog__feature-card">
              <p className="changelog__feature-desc">
                The inaugural public release of Hesh UI, delivering a comprehensive toolkit for building high-performance, accessible React applications with token-driven styling:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '0.25rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <CheckIcon size={16} style={{ color: 'var(--pui-success)', flexShrink: 0, marginTop: '0.25rem' }} />
                  <span style={{ fontSize: '0.875rem', color: 'var(--pui-fg)' }}>
                    <strong>80 Core Components:</strong> Complete primitives for forms, navigation, feedback, overlays, and charts.
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <CheckIcon size={16} style={{ color: 'var(--pui-success)', flexShrink: 0, marginTop: '0.25rem' }} />
                  <span style={{ fontSize: '0.875rem', color: 'var(--pui-fg)' }}>
                    <strong>Token-Driven Theming:</strong> Instant light/dark/system support with zero runtime CSS-in-JS overhead.
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <CheckIcon size={16} style={{ color: 'var(--pui-success)', flexShrink: 0, marginTop: '0.25rem' }} />
                  <span style={{ fontSize: '0.875rem', color: 'var(--pui-fg)' }}>
                    <strong>Code Ownership CLI:</strong> <code>npx hesh-ui add &lt;component&gt;</code> copies source directly into your repository.
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <CheckIcon size={16} style={{ color: 'var(--pui-success)', flexShrink: 0, marginTop: '0.25rem' }} />
                  <span style={{ fontSize: '0.875rem', color: 'var(--pui-fg)' }}>
                    <strong>Accessibility by Default:</strong> Keyboard roving tabindex, ARIA roles, and screen-reader tested.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Separator style={{ marginBlock: '2rem' }} />

      <Section title="Upgrade Path">
        <p style={{ color: 'var(--pui-fg-muted)', fontSize: '0.9375rem', lineHeight: '1.6' }}>
          Upgrading from v1.0.0 to v1.1.0 requires zero breaking changes. Simply pull the latest release or update via your preferred package manager:
        </p>

        <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Button
            size="md"
            variant="primary"
            onClick={() => {
              if (typeof window !== 'undefined') window.location.hash = '#/getting-started';
            }}
            rightIcon={<ArrowRightIcon size={14} />}
          >
            Installation Guide
          </Button>
          <Button
            size="md"
            variant="outline"
            onClick={() => {
              if (typeof window !== 'undefined') window.location.hash = '#/blocks';
            }}
          >
            Browse Production Blocks
          </Button>
        </div>
      </Section>
    </DocPage>
  );
}
