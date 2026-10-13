import { useState } from 'react';
import { useToast, Button, type ToastTone } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const FLUENT_DEMO = `// Fluent shorthand methods (works with hook or standalone import)
toast.success('Project deployed successfully!');
toast.error('Database connection failed', 'Check your credentials in settings');

// Promise-based toast for async operations
toast.promise(
  fetch('/api/deploy'),
  {
    loading: 'Deploying release v2.4.0...',
    success: 'Deployment live on edge servers!',
    error: (err) => \`Deploy failed: \${err.message}\`,
  }
);`;

const ACTION_TOAST_DEMO = `const { toast, dismiss } = useToast();

toast({
  tone: 'success',
  title: 'Project archived',
  description: 'Project "analytics-engine" moved to trash.',
  action: (
    <Button
      size="sm"
      variant="outline"
      onClick={() => {
        alert('Archival undone!');
      }}
    >
      Undo Action
    </Button>
  ),
});`;

export function ToastPage() {
  const { toast } = useToast();
  const tones: ToastTone[] = ['info', 'success', 'warning', 'danger'];
  const [loadingPromise, setLoadingPromise] = useState(false);

  const simulatePromise = (shouldFail = false) => {
    setLoadingPromise(true);
    const mockTask = new Promise<string>((resolve, reject) => {
      setTimeout(() => {
        if (shouldFail) reject(new Error('Network gateway timeout (504)'));
        else resolve('Artifact build #8492 compiled in 1.4s');
      }, 1800);
    });

    toast.promise(mockTask, {
      loading: 'Building production bundle...',
      success: (data) => `${data}!`,
      error: (err) => String(err),
    }).finally(() => {
      setLoadingPromise(false);
    });
  };

  return (
    <DocPage
      eyebrow="Components"
      title="Toast"
      lede="Transient notification system with fluent shortcuts, promise lifecycle tracking, auto-dismiss timers, and accessible ARIA announcements."
      importStatement="import { useToast, toast, ToastProvider } from 'hesh-ui';"
    >
      <Section
        title="Fluent Shorthands & Promise Toasts (High DX)"
        description="Trigger success, error, info, or track asynchronous promises with automatic state transitions."
      >
        <Showcase code={FLUENT_DEMO} defaultOpen width="md">
          <div className="row-wrap" style={{ gap: '0.75rem' }}>
            <Button
              variant="success"
              size="sm"
              onClick={() => toast.success('Changes saved successfully', 'Configuration updated in all regions')}
            >
              toast.success()
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => toast.error('Payment method declined', 'Please update your card on file')}
            >
              toast.error()
            </Button>
            <Button
              variant="primary"
              size="sm"
              loading={loadingPromise}
              onClick={() => simulatePromise(false)}
            >
              toast.promise() (Success)
            </Button>
            <Button
              variant="outline"
              size="sm"
              loading={loadingPromise}
              onClick={() => simulatePromise(true)}
            >
              toast.promise() (Rejection)
            </Button>
          </div>
        </Showcase>
      </Section>

      <Section
        title="Trigger Standard Notifications"
        description="Config-driven toast invocation with customizable tone, lifetime, and descriptions."
      >
        <Showcase code={`toast({ tone: 'success', title: '...', description: '...' })`} width="md">
          <div className="row-wrap" style={{ gap: '0.75rem' }}>
            {tones.map((tone) => (
              <Button
                key={tone}
                size="sm"
                variant={tone === 'danger' ? 'danger' : 'secondary'}
                onClick={() => {
                  toast({
                    tone,
                    title: `${tone[0]!.toUpperCase()}${tone.slice(1)} notification`,
                    description: `Event completed successfully in ${tone} channel.`,
                  });
                }}
              >
                {tone} toast
              </Button>
            ))}
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                toast({
                  title: 'Persistent notification',
                  description: 'duration={0} keeps it open until manually dismissed.',
                  duration: 0,
                });
              }}
            >
              Persistent toast
            </Button>
          </div>
        </Showcase>
      </Section>

      <Section
        title="Toasts with Interactive Actions"
        description="Incorporate CTA action buttons directly inside notifications, such as Undo, View Logs, or Retry."
      >
        <Showcase code={ACTION_TOAST_DEMO} width="md">
          <div className="row-wrap" style={{ gap: '0.75rem' }}>
            <Button
              variant="secondary"
              onClick={() => {
                toast({
                  tone: 'info',
                  title: 'Branch deleted',
                  description: 'Git branch "feature/speed-dial" was deleted.',
                  action: (
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                      <Button size="sm" variant="outline" onClick={() => alert('Restoring branch...')}>
                        Restore Branch
                      </Button>
                    </div>
                  ),
                });
              }}
            >
              Delete Branch (with Undo)
            </Button>

            <Button
              variant="danger"
              onClick={() => {
                toast({
                  tone: 'danger',
                  title: 'Connection timed out',
                  description: 'Failed to reach API gateway at eu-west-1.',
                  action: (
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                      <Button size="sm" variant="secondary" onClick={() => alert('Retrying connection...')}>
                        Retry Request
                      </Button>
                    </div>
                  ),
                });
              }}
            >
              Failed API Call (with Retry)
            </Button>

            <Button
              variant="success"
              onClick={() => {
                toast({
                  tone: 'success',
                  title: 'Build published',
                  description: 'Production release v2.4.0 is now live.',
                  action: (
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                      <Button size="sm" variant="outline" onClick={() => alert('Viewing deploy logs...')}>
                        View Deployment
                      </Button>
                    </div>
                  ),
                });
              }}
            >
              Deploy Success (with Link)
            </Button>
          </div>
        </Showcase>
      </Section>

      <Section
        title="Setup & Provider"
        description="Mount ToastProvider once near the root of your application."
      >
        <Showcase
          code={`import { ToastProvider, toast } from 'hesh-ui';

function Root() {
  return (
    <ToastProvider placement="bottom-right" duration={4500} limit={4}>
      <App />
    </ToastProvider>
  );
}

// In any component or service file:
toast.success('Profile updated!');`}
          width="md"
        >
          <div className="stack" style={{ gap: '0.75rem' }}>
            <p className="prose">
              The ToastProvider manages the singleton toast portal container, auto-dismiss timers, exit slide animations, and ARIA polite/assertive announcer live regions.
            </p>
          </div>
        </Showcase>
      </Section>

      <Section title="Accessibility">
        <Callout tone="info" title="ARIA Live Regions & Assertive Escalation">
          Messages with <code className="pui-code">tone=&quot;info&quot;</code> or <code className="pui-code">tone=&quot;success&quot;</code> are dispatched with <code className="pui-code">aria-live=&quot;polite&quot;</code> to avoid cutting off screen reader speech. High-priority errors (<code className="pui-code">tone=&quot;danger&quot;</code>) escalate to <code className="pui-code">aria-live=&quot;assertive&quot;</code> so users hear critical failures immediately.
        </Callout>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'toast.success(title, desc?)', type: '(title: ReactNode, desc?: ReactNode) => number', description: 'Quick shorthand for success notifications.' },
            { name: 'toast.error(title, desc?)', type: '(title: ReactNode, desc?: ReactNode) => number', description: 'Quick shorthand for danger/error notifications.' },
            { name: 'toast.promise(promise, options)', type: '<T>(p: Promise<T>, opts: ToastPromiseOptions<T>) => Promise<T>', description: 'Automatically displays loading state and updates to success or error.' },
            { name: 'toast(options)', type: '(options: ToastOptions) => number', description: 'Triggers a toast and returns a unique ID.' },
            { name: 'dismiss(id)', type: '(id: number) => void', description: 'Dismisses a specific toast with an exit transition.' },
            { name: 'ToastOptions.title', type: 'ReactNode', required: true, description: 'Header line of the notification.' },
            { name: 'ToastOptions.description', type: 'ReactNode', description: 'Detailed body text or element.' },
            { name: 'ToastOptions.tone', type: "'info' | 'success' | 'warning' | 'danger'", default: "'info'", description: 'Visual status color.' },
            { name: 'ToastOptions.action', type: 'ReactNode', description: 'Optional interactive CTA button or link.' },
            { name: 'ToastOptions.duration', type: 'number', default: '4500', description: 'Auto-dismiss delay in ms. Pass 0 to keep open indefinitely.' },
            { name: 'ToastProvider.placement', type: "'bottom-right' | 'top-right' | 'bottom-left' | 'top-center'", default: "'bottom-right'", description: 'Corner of the screen where toasts anchor.' },
            { name: 'ToastProvider.limit', type: 'number', default: '3', description: 'Maximum visible toasts before oldest are dequeued.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
