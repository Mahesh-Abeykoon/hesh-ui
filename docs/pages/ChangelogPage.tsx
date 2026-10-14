import { Badge, Button, Card, CardBody, CardHeader, Separator } from '../../src/index';
import { ArrowRightIcon } from '../../src/index';
import { DocPage, Section } from '../components/DocPage';

export function ChangelogPage() {
  return (
    <DocPage
      eyebrow="Releases"
      title="Release Notes"
      lede="All notable changes, new features, and improvements across Hesh UI versions."
    >
      <Section title="Version History">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* v1.1.0 */}
          <Card>
            <CardHeader
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>v1.1.0</span>
                  <Badge tone="success" variant="subtle" dot pulse>Latest</Badge>
                  <span style={{ fontSize: '0.875rem', color: 'var(--pui-fg-muted)' }}>October 2026</span>
                </div>
              }
              description="Essential Hooks Suite, Production Blocks, CLI enhancements, AST Unused Import auto-fixer, and design system elevation polish."
            />
            <CardBody>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--pui-fg)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Badge tone="primary" variant="subtle">New Feature</Badge> Essential Hooks Suite
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--pui-fg-muted)', fontSize: '0.875rem', lineHeight: '1.6' }}>
                    <li><code>useMediaQuery</code>: Responsive CSS breakpoint queries with live listeners and SSR safety.</li>
                    <li><code>useDebounce</code>: High-performance value and callback debouncing with cancel/flush controls.</li>
                    <li><code>useLocalStorage</code>: Type-safe reactive storage hook with cross-tab sync and JSON serialization.</li>
                    <li><code>useClipboard</code>: Single-click clipboard copying with auto-reset success state.</li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--pui-fg)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Badge tone="primary" variant="subtle">New Feature</Badge> Production Blocks & Superpowers
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--pui-fg-muted)', fontSize: '0.875rem', lineHeight: '1.6' }}>
                    <li>Added 6 production-grade full-page blocks: Hero, Authentication, Pricing, Dashboard, Account Settings, and Multi-step Onboarding.</li>
                    <li>Combobox Superpowers: Added <code>creatable</code>, <code>async</code>, and <code>virtualized</code> modes.</li>
                    <li>CodeGroup: Multi-tab code snippets with active tabs and instant copying.</li>
                    <li>Skeleton Compound Presets: <code>Skeleton.Text</code>, <code>Skeleton.Avatar</code>, <code>Skeleton.Card</code>.</li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--pui-fg)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Badge tone="info" variant="outline">Tooling & CI</Badge> Automated Import Fixer & CI Modernization
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--pui-fg-muted)', fontSize: '0.875rem', lineHeight: '1.6' }}>
                    <li>Added AST-based <code>npm run lint:fix</code> (alias <code>npm run fix:unused</code>) to automatically remove unused imports.</li>
                    <li>Modernized GitHub Actions CI workflow with 4 parallel jobs (Lint / Unused Imports, Type Check, Test Suite, Production Build).</li>
                    <li>CLI improvements: Scaffolding, transitive dependency resolution, and aliased imports.</li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--pui-fg)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Badge tone="neutral" variant="subtle">Polish</Badge> Refined Hover States & Branding
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--pui-fg-muted)', fontSize: '0.875rem', lineHeight: '1.6' }}>
                    <li>Removed bright cyan hover outlines across all cards, inputs, and buttons in favor of natural, premium elevation shadows.</li>
                    <li>Aligned flagship logo alongside full-width heading in hero section.</li>
                  </ul>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* v1.0.0 */}
          <Card>
            <CardHeader
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>v1.0.0</span>
                  <Badge tone="neutral" variant="outline">Initial Release</Badge>
                  <span style={{ fontSize: '0.875rem', color: 'var(--pui-fg-muted)' }}>October 2026</span>
                </div>
              }
              description="The foundational release of Hesh UI — 80 accessible React components, token-driven theming, and CLI tooling."
            />
            <CardBody>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--pui-fg-muted)', fontSize: '0.875rem', lineHeight: '1.6' }}>
                <li><strong>80 Core Components:</strong> Complete set of form controls, overlays, navigation, layout, feedback, and data visualization primitives.</li>
                <li><strong>Token-Driven Theming:</strong> Pure CSS variables with instant dark/light/system mode switching and interactive Theme Studio.</li>
                <li><strong>Built-in CLI:</strong> <code>npx hesh-ui init</code>, <code>npx hesh-ui add</code>, and <code>npx hesh-ui list</code> for direct code ownership.</li>
                <li><strong>Accessibility (a11y):</strong> Full WAI-ARIA compliance, roving tabindex, keyboard navigation, and screen-reader support.</li>
                <li><strong>Zero Runtime Overhead:</strong> No emotion, styled-components, or external runtime dependencies beyond React.</li>
              </ul>
            </CardBody>
          </Card>
        </div>
      </Section>

      <Section title="Upgrading to v1.1.0">
        <p style={{ color: 'var(--pui-fg-muted)', fontSize: '0.9375rem', lineHeight: '1.6' }}>
          Hesh UI v1.1.0 is 100% backwards-compatible with v1.0.0. To update in your project:
        </p>
        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Button
            size="md"
            variant="primary"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.location.hash = '#/getting-started';
              }
            }}
            rightIcon={<ArrowRightIcon />}
          >
            Getting Started Guide
          </Button>
          <Button
            size="md"
            variant="outline"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.location.hash = '#/blocks';
              }
            }}
          >
            Explore Production Blocks
          </Button>
        </div>
      </Section>
    </DocPage>
  );
}
