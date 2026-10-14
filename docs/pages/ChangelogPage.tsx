import { Badge, Button, Separator } from '../../src/index';
import { ArrowRightIcon, CheckIcon, ExternalLinkIcon } from '../../src/index';
import { DocPage, Section } from '../components/DocPage';
import { CodeBlock } from '../components/CodeBlock';

const HOOKS_SNIPPET = `import { useMediaQuery, useLocalStorage, useClipboard, useDebounce } from 'hesh-ui';

export function UserSettings() {
  // 1. Listen for responsive breakpoint changes
  const isMobile = useMediaQuery('(max-width: 768px)');

  // 2. Synced local storage state across browser tabs
  const [theme, setTheme] = useLocalStorage('hesh-theme', 'system');

  // 3. One-click clipboard copying with auto-reset
  const { copy, copied } = useClipboard({ timeout: 2000 });

  // 4. Debounced search input
  const [query, setQuery] = useState('');
  const debounced = useDebounce(query, 250);

  return (
    <div className="settings-panel">
      <p>Device: {isMobile ? 'Mobile' : 'Desktop'}</p>
      <button onClick={() => copy('npm install hesh-ui')}>
        {copied ? 'Copied!' : 'Copy install command'}
      </button>
    </div>
  );
}`;

export function ChangelogPage() {
  return (
    <DocPage
      eyebrow="Changelog"
      title="Release Notes"
      lede="New features, fixes, and improvements in Hesh UI."
    >
      {/* High-level digest cards */}
      <div className="changelog__stats-grid">
        <div className="changelog__stat-card">
          <span className="changelog__stat-num">v1.1.0</span>
          <span className="changelog__stat-label">Stable Release</span>
        </div>
        <div className="changelog__stat-card">
          <span className="changelog__stat-num">+4</span>
          <span className="changelog__stat-label">Custom React Hooks</span>
        </div>
        <div className="changelog__stat-card">
          <span className="changelog__stat-num">+6</span>
          <span className="changelog__stat-label">Pre-built Page Blocks</span>
        </div>
        <div className="changelog__stat-card">
          <span className="changelog__stat-num">80</span>
          <span className="changelog__stat-label">Accessible Components</span>
        </div>
      </div>

      <Section title="Version History">
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
                GitHub <ExternalLinkIcon size={12} />
              </a>
            </div>

            {/* Feature 1: Hooks Suite */}
            <div className="changelog__feature-card">
              <div className="changelog__feature-head">
                <div className="changelog__feature-title">
                  <Badge tone="primary" variant="subtle">New</Badge>
                  <span>4 New React Hooks</span>
                </div>
                <div className="changelog__pill-grid">
                  <span className="changelog__pill">useMediaQuery</span>
                  <span className="changelog__pill">useDebounce</span>
                  <span className="changelog__pill">useLocalStorage</span>
                  <span className="changelog__pill">useClipboard</span>
                </div>
              </div>

              <p className="changelog__feature-desc">
                Added four lightweight, SSR-safe hooks for handling responsive CSS media queries, state debouncing, cross-tab synced storage, and clipboard copying. All hooks are written in strict TypeScript with zero extra dependencies.
              </p>

              <CodeBlock
                code={HOOKS_SNIPPET}
                language="tsx"
                filename="hooks-example.tsx"
                copyable
                embedded
              />
            </div>

            {/* Feature 2: Production Blocks & Combobox */}
            <div className="changelog__feature-card">
              <div className="changelog__feature-head">
                <div className="changelog__feature-title">
                  <Badge tone="info" variant="subtle">New</Badge>
                  <span>Pre-built Page Blocks & Combobox Updates</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    if (typeof window !== 'undefined') window.location.hash = '#/blocks';
                  }}
                  rightIcon={<ArrowRightIcon size={14} />}
                >
                  Browse blocks
                </Button>
              </div>

              <p className="changelog__feature-desc">
                Added 6 pre-built, production-ready block compositions you can copy into your apps:
              </p>

              <div className="changelog__pill-grid">
                <span className="changelog__pill">Hero section</span>
                <span className="changelog__pill">Authentication</span>
                <span className="changelog__pill">Pricing matrix</span>
                <span className="changelog__pill">Dashboard metrics</span>
                <span className="changelog__pill">Account settings</span>
                <span className="changelog__pill">Onboarding flow</span>
              </div>

              <p className="changelog__feature-desc" style={{ marginTop: '0.25rem' }}>
                Combobox also gained support for <strong>creatable custom items</strong>, <strong>async search</strong> streaming with loading spinners, and <strong>virtualized lists</strong> for rendering large datasets smoothly.
              </p>
            </div>

            {/* Feature 3: AST Import Cleaner & CI */}
            <div className="changelog__feature-card">
              <div className="changelog__feature-head">
                <div className="changelog__feature-title">
                  <Badge tone="warning" variant="subtle">CLI & Tooling</Badge>
                  <span>Automated Import Cleaner & CI Checks</span>
                </div>
                <Badge tone="neutral" variant="outline">package.json</Badge>
              </div>

              <p className="changelog__feature-desc">
                Added a TypeScript AST script that inspects source files and removes unused imports without touching code formatting. Integrated with GitHub Actions to catch unreferenced imports before pull requests get merged:
              </p>

              <div className="changelog__terminal">
                <div className="changelog__terminal-line">
                  <span className="changelog__terminal-prompt">$</span>
                  <span className="changelog__terminal-cmd">npm run lint:fix</span>
                  <span className="changelog__terminal-comment"># Cleans unused imports automatically</span>
                </div>
                <div className="changelog__terminal-line">
                  <span className="changelog__terminal-prompt">$</span>
                  <span className="changelog__terminal-cmd">npm run lint:unused</span>
                  <span className="changelog__terminal-comment"># CI check used in GitHub Actions</span>
                </div>
              </div>
            </div>

            {/* Feature 4: Design Polish */}
            <div className="changelog__feature-card">
              <div className="changelog__feature-head">
                <div className="changelog__feature-title">
                  <Badge tone="neutral" variant="subtle">Design</Badge>
                  <span>Clean Hover Elevation & Hero Layout</span>
                </div>
              </div>

              <p className="changelog__feature-desc">
                Replaced harsh light-blue hover outlines on cards and buttons with clean, neutral elevation shadows. Redesigned the homepage hero to let the title span full width alongside the brand logo.
              </p>
            </div>
          </div>

          {/* ================================================================= v1.0.0 */}
          <div className="changelog__entry">
            <span className="changelog__entry-node changelog__entry-node--past" />

            <div className="changelog__entry-header">
              <div className="changelog__entry-version-row">
                <span className="changelog__entry-version">v1.0.0</span>
                <Badge tone="neutral" variant="outline">Initial Release</Badge>
                <span className="changelog__entry-date">October 2026</span>
              </div>
            </div>

            <div className="changelog__feature-card">
              <p className="changelog__feature-desc">
                First public release of Hesh UI: 80 accessible React components, token-based theming, and CLI code-scaffolding:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '0.25rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <CheckIcon size={16} style={{ color: 'var(--pui-success)', flexShrink: 0, marginTop: '0.25rem' }} />
                  <span style={{ fontSize: '0.875rem', color: 'var(--pui-fg)' }}>
                    <strong>80 Core Components:</strong> Complete set of form controls, navigation, feedback, overlays, and charts.
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <CheckIcon size={16} style={{ color: 'var(--pui-success)', flexShrink: 0, marginTop: '0.25rem' }} />
                  <span style={{ fontSize: '0.875rem', color: 'var(--pui-fg)' }}>
                    <strong>Token-Driven Theming:</strong> Pure CSS variables with light, dark, and system modes.
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <CheckIcon size={16} style={{ color: 'var(--pui-success)', flexShrink: 0, marginTop: '0.25rem' }} />
                  <span style={{ fontSize: '0.875rem', color: 'var(--pui-fg)' }}>
                    <strong>CLI Tooling:</strong> <code>npx hesh-ui add &lt;component&gt;</code> copies source directly into your project.
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <CheckIcon size={16} style={{ color: 'var(--pui-success)', flexShrink: 0, marginTop: '0.25rem' }} />
                  <span style={{ fontSize: '0.875rem', color: 'var(--pui-fg)' }}>
                    <strong>Accessible by Default:</strong> Keyboard roving tabindex, focus management, and WAI-ARIA roles.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Separator style={{ marginBlock: '2rem' }} />

      <Section title="Upgrading to v1.1.0">
        <p style={{ color: 'var(--pui-fg-muted)', fontSize: '0.9375rem', lineHeight: '1.6' }}>
          There are no breaking changes in v1.1.0. To update in an existing project:
        </p>

        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Button
            size="md"
            variant="primary"
            onClick={() => {
              if (typeof window !== 'undefined') window.location.hash = '#/getting-started';
            }}
            rightIcon={<ArrowRightIcon size={14} />}
          >
            Installation guide
          </Button>
          <Button
            size="md"
            variant="outline"
            onClick={() => {
              if (typeof window !== 'undefined') window.location.hash = '#/blocks';
            }}
          >
            Browse page blocks
          </Button>
        </div>
      </Section>
    </DocPage>
  );
}
