import { useState } from 'react';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  DataTable,
  Dropzone,
  Input,
  PasswordInput,
  Select,
  Sparkline,
  Stat,
  Switch,
  Tabs,
  ThemeSwitch,
  exportToCsv,
  FieldShell,
  toast,
  type Column,
} from '../../src/index';
import { DocPage, Section } from '../components/DocPage';
import { Showcase } from '../components/Showcase';
import { CheckIcon } from '../../src/index';

/* ---------------------------------------------------------------- Block 1: Auth */

function BlockAuth() {
  const [tab, setTab] = useState('login');
  const [loading, setLoading] = useState(false);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success(tab === 'login' ? 'Signed in successfully!' : 'Account registered!', 'Redirecting to console...');
    }, 900);
  };

  return (
    <Card padded style={{ width: '100%', maxWidth: '420px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Welcome to Acme Cloud</h3>
        <p className="prose" style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
          Production-grade infrastructure control panel
        </p>
      </div>

      <Tabs
        variant="pills"
        fullWidth
        value={tab}
        onValueChange={setTab}
        items={[
          { value: 'login', label: 'Sign In' },
          { value: 'register', label: 'Create Account' },
        ]}
      />

      <form onSubmit={handleAuthSubmit} style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {tab === 'register' && (
          <Input label="Full Name" placeholder="Mahesh Abeykoon" required />
        )}

        <Input label="Email address" type="email" placeholder="name@company.com" required />

        <FieldShell id="block-auth-password" label="Password" required>
          {(describedBy) => (
            <PasswordInput
              id="block-auth-password"
              aria-describedby={describedBy}
              placeholder="Enter secret passphrase"
              strengthMeter={tab === 'register'}
              required
            />
          )}
        </FieldShell>

        {tab === 'login' ? (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8125rem' }}>
            <Checkbox label="Remember this device for 30 days" defaultChecked />
            <a href="#forgot" onClick={(e) => { e.preventDefault(); toast.info('Password reset email sent'); }}>
              Forgot password?
            </a>
          </div>
        ) : (
          <Checkbox label="I accept terms of service and security policy" required defaultChecked />
        )}

        <Button type="submit" variant="primary" loading={loading} style={{ marginTop: '0.5rem' }}>
          {tab === 'login' ? 'Sign In to Console' : 'Get Started for Free'}
        </Button>
      </form>
    </Card>
  );
}

/* ---------------------------------------------------------------- Block 2: Metrics */

function BlockMetrics() {
  const sampleData1 = [12, 19, 15, 25, 22, 30, 28, 38, 45, 52];
  const sampleData2 = [40, 38, 42, 35, 48, 45, 50, 49, 58, 62];
  const sampleData3 = [8, 12, 11, 14, 13, 10, 9, 12, 11, 14];
  const sampleData4 = [120, 115, 128, 132, 140, 135, 148, 152, 160, 168];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1rem', width: '100%' }}>
      <Card padded>
        <Stat
          label="Total Monthly Revenue"
          value="$148,290"
          delta={14.2}
        >
          <Sparkline data={sampleData1} color="var(--pui-success, #16a34a)" filled height={36} />
        </Stat>
      </Card>

      <Card padded>
        <Stat
          label="Active User Sessions"
          value="34,920"
          delta={8.1}
        >
          <Sparkline data={sampleData2} color="var(--pui-brand-base, #2563eb)" filled height={36} />
        </Stat>
      </Card>

      <Card padded>
        <Stat
          label="API Error Rate"
          value="0.04%"
          delta={-0.02}
          deltaLabel="-0.02% error rate"
        >
          <Sparkline data={sampleData3} color="var(--pui-danger, #dc2626)" filled height={36} />
        </Stat>
      </Card>

      <Card padded>
        <Stat
          label="Average Order Value"
          value="$168.40"
          delta={5.6}
        >
          <Sparkline data={sampleData4} color="var(--pui-info, #0284c7)" filled height={36} />
        </Stat>
      </Card>
    </div>
  );
}

/* ---------------------------------------------------------------- Block 3: Settings */

function BlockSettings() {
  const [saving, setSaving] = useState(false);

  const handleSaveSettings = () => {
    setSaving(true);
    const mockSave = new Promise((resolve) => setTimeout(resolve, 1100));
    toast.promise(mockSave, {
      loading: 'Saving workspace preferences...',
      success: 'All settings updated across all regions!',
      error: 'Failed to update preferences.',
    }).finally(() => setSaving(false));
  };

  return (
    <Card padded style={{ width: '100%', maxWidth: '680px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h3 style={{ margin: 0 }}>Organization Profile</h3>
          <p className="prose" style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Manage identity, billing notifications, and security defaults.
          </p>
        </div>
        <ThemeSwitch />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
          <Avatar name="Mahesh Abeykoon" size="lg" />
          <div style={{ flex: 1 }}>
            <Dropzone
              accept="image/*"
              maxFiles={1}
              onFilesChange={() => toast.success('Avatar uploaded!')}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Input label="Workspace Name" defaultValue="Acme High Performance" />
          <Input label="Admin Email" defaultValue="mahesh@hesh.dev" />
        </div>

        <Select
          label="Primary Region"
          options={[
            { value: 'us-east-1', label: 'US East (N. Virginia)' },
            { value: 'eu-west-1', label: 'EU West (Frankfurt)' },
            { value: 'ap-south-1', label: 'Asia Pacific (Mumbai)' },
          ]}
          defaultValue="us-east-1"
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid var(--pui-border)', paddingTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Automated Daily Backups</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--pui-text-muted)' }}>Snapshot databases every 24 hours to cold storage</div>
            </div>
            <Switch defaultChecked />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Security Vulnerability Webhooks</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--pui-text-muted)' }}>Send urgent incident alerts to dedicated Slack channel</div>
            </div>
            <Switch defaultChecked />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
          <Button variant="secondary" onClick={() => toast.info('Changes discarded')}>Cancel</Button>
          <Button variant="primary" loading={saving} onClick={handleSaveSettings}>Save Changes</Button>
        </div>
      </div>
    </Card>
  );
}

/* ---------------------------------------------------------------- Block 4: Crud Table */

interface TeamUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'suspended';
}

const USERS_DATA: TeamUser[] = [
  { id: '1', name: 'Mahesh Abeykoon', email: 'mahesh@hesh.dev', role: 'Owner', status: 'active' },
  { id: '2', name: 'Ada Lovelace', email: 'ada@analytical.dev', role: 'Admin', status: 'active' },
  { id: '3', name: 'Alan Turing', email: 'alan@bletchley.dev', role: 'Security Eng', status: 'active' },
  { id: '4', name: 'Grace Hopper', email: 'grace@navy.gov', role: 'Lead Architect', status: 'active' },
  { id: '5', name: 'Linus Torvalds', email: 'linus@kernel.org', role: 'Contributor', status: 'suspended' },
  { id: '6', name: 'Katherine Johnson', email: 'kj@nasa.gov', role: 'Senior Dev', status: 'active' },
];

function BlockCrudTable() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>(['1']);
  const [page, setPage] = useState(1);

  const filtered = USERS_DATA.filter((u: TeamUser) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<TeamUser>[] = [
    {
      id: 'name',
      header: 'Team Member',
      accessor: (u) => u.name,
      cell: (u) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <Avatar name={u.name} size="sm" />
          <div>
            <div style={{ fontWeight: 600 }}>{u.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--pui-text-muted)' }}>{u.email}</div>
          </div>
        </div>
      ),
    },
    {
      id: 'role',
      header: 'Role',
      accessor: (u: TeamUser) => u.role,
      cell: (u: TeamUser) => <Badge tone="neutral" size="sm">{u.role}</Badge>,
    },
    {
      id: 'status',
      header: 'Account Status',
      accessor: (u: TeamUser) => u.status,
      cell: (u: TeamUser) => (
        <Badge tone={u.status === 'active' ? 'success' : 'danger'} size="sm">
          {u.status}
        </Badge>
      ),
    },
  ];

  return (
    <Card padded style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ width: '280px' }}>
          <Input
            placeholder="Search team members..."
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            clearable
            onClear={() => setSearch('')}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button
            size="sm"
            variant="outline"
            onClick={() => exportToCsv(columns, filtered, 'team-roster.csv')}
          >
            Export CSV
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => toast.success('Invite link copied to clipboard')}
          >
            Invite Member
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        rowKey={(u: TeamUser) => u.id}
        selectable
        selectedKeys={selected}
        onSelectionChange={setSelected}
        pagination={{
          page,
          total: filtered.length,
          pageSize: 4,
          onPageChange: setPage,
          showTotal: true,
        }}
        bulkActions={(keys: string[]) => (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button
              size="sm"
              variant="danger"
              onClick={() => {
                toast.success(`Suspended ${keys.length} selected users`);
                setSelected([]);
              }}
            >
              Suspend Selected
            </Button>
          </div>
        )}
      />
    </Card>
  );
}


/* ---------------------------------------------------------------- Block 5: Pricing */

function BlockPricing() {
  const [annual, setAnnual] = useState(true);

  const tiers = [
    {
      name: 'Starter',
      price: annual ? '$0' : '$0',
      period: annual ? 'forever free' : 'forever free',
      desc: 'Perfect for indie hackers, hobby projects, and open source prototypes.',
      popular: false,
      features: [
        'Up to 3 production projects',
        'Community Discord & Forum support',
        '10,000 monthly API invocations',
        'Global edge cache acceleration',
      ],
      buttonText: 'Start for Free',
      buttonVariant: 'secondary' as const,
    },
    {
      name: 'Professional',
      price: annual ? '$24' : '$29',
      period: 'per month',
      desc: 'For high-velocity engineering teams scaling critical SaaS workloads.',
      popular: true,
      features: [
        'Unlimited active projects',
        '24/7 priority SLA support',
        '1,000,000 monthly API invocations',
        'Custom domain SSL provisioning',
        'Automated database snapshots',
        'Advanced anomaly alert webhooks',
      ],
      buttonText: 'Upgrade to Pro',
      buttonVariant: 'primary' as const,
    },
    {
      name: 'Enterprise',
      price: annual ? '$99' : '$119',
      period: 'per month, billed annually',
      desc: 'Enterprise security, compliance, SSO governance, and dedicated infrastructure.',
      popular: false,
      features: [
        'Isolated private VPC clusters',
        '99.99% uptime guarantee SLA',
        'SAML, Okta, and Google SSO',
        'HIPAA & SOC 2 Type II compliance',
        'Dedicated Solutions Architect',
      ],
      buttonText: 'Contact Sales',
      buttonVariant: 'outline' as const,
    },
  ];

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <span style={{ fontSize: '0.875rem', fontWeight: annual ? 500 : 600 }}>Monthly</span>
        <Switch checked={annual} onCheckedChange={setAnnual} />
        <span style={{ fontSize: '0.875rem', fontWeight: annual ? 600 : 500 }}>
          Annual Billing
        </span>
        <Badge tone="success" size="sm" pill>
          Save 20%
        </Badge>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.25rem',
          width: '100%',
        }}
      >
        {tiers.map((t) => (
          <Card
            key={t.name}
            padded
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              borderColor: t.popular ? 'var(--pui-primary)' : undefined,
              boxShadow: t.popular ? '0 0 0 2px var(--pui-primary), var(--pui-shadow-lg)' : undefined,
            }}
          >
            <div>
              {t.popular && (
                <div style={{ position: 'absolute', top: '-11px', right: '1.25rem' }}>
                  <Badge tone="primary" size="sm">
                    Most Popular
                  </Badge>
                </div>
              )}
              <h4 style={{ margin: 0, fontSize: '1.125rem' }}>{t.name}</h4>
              <p className="prose" style={{ fontSize: '0.8125rem', marginTop: '0.375rem', minHeight: '2.5rem' }}>
                {t.desc}
              </p>

              <div style={{ marginTop: '1rem', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '2rem', fontWeight: 700 }}>{t.price}</span>
                <span style={{ fontSize: '0.8125rem', color: 'var(--pui-text-muted)', marginLeft: '0.375rem' }}>
                  /{t.period}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', borderTop: '1px solid var(--pui-border)', paddingTop: '1rem' }}>
                {t.features.map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.8125rem' }}>
                    <span style={{ color: 'var(--pui-success)', marginTop: '2px' }}>
                      <CheckIcon />
                    </span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button
              variant={t.buttonVariant}
              fullWidth
              style={{ marginTop: '1.75rem' }}
              onClick={() => toast.success(`Selected ${t.name} plan`, 'Redirecting to checkout...')}
            >
              {t.buttonText}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- Block 6: Onboarding */

function BlockEmptyStateOnboarding() {
  const [step1Done, setStep1Done] = useState(true);
  const [step2Done, setStep2Done] = useState(false);
  const [step3Done, setStep3Done] = useState(false);

  const completedCount = [step1Done, step2Done, step3Done].filter(Boolean).length;

  return (
    <Card
      padded
      style={{
        width: '100%',
        maxWidth: '680px',
        margin: '0 auto',
        borderStyle: 'dashed',
        borderWidth: '2px',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <Badge tone="info" size="sm" pill style={{ marginBottom: '0.5rem' }}>
          Workspace Setup Checklist
        </Badge>
        <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Welcome to your new deployment cluster</h3>
        <p className="prose" style={{ fontSize: '0.875rem', marginTop: '0.375rem' }}>
          Complete the foundational steps below to trigger your first zero-downtime release.
        </p>
        <div style={{ marginTop: '0.75rem', fontSize: '0.8125rem', color: 'var(--pui-primary)', fontWeight: 600 }}>
          {completedCount} of 3 tasks completed ({Math.round((completedCount / 3) * 100)}%)
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {/* Step 1 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--pui-radius-md)',
            background: 'var(--pui-surface-subtle)',
            border: '1px solid var(--pui-border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Checkbox
              checked={step1Done}
              onChange={(e) => setStep1Done(e.target.checked)}
            />
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', textDecoration: step1Done ? 'line-through' : 'none' }}>
                Connect GitHub Repository
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--pui-text-muted)' }}>
                Linked to <code>org/core-platform-engine</code>
              </div>
            </div>
          </div>
          <Badge tone={step1Done ? 'success' : 'neutral'} size="sm">
            {step1Done ? 'Connected' : 'Pending'}
          </Badge>
        </div>

        {/* Step 2 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--pui-radius-md)',
            background: 'var(--pui-surface-subtle)',
            border: '1px solid var(--pui-border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Checkbox
              checked={step2Done}
              onChange={(e) => setStep2Done(e.target.checked)}
            />
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', textDecoration: step2Done ? 'line-through' : 'none' }}>
                Configure Production Environment Secrets
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--pui-text-muted)' }}>
                Add DATABASE_URL, API_KEY, and ENCRYPTION_SALT
              </div>
            </div>
          </div>
          <Button
            size="sm"
            variant={step2Done ? 'outline' : 'secondary'}
            onClick={() => {
              setStep2Done(true);
              toast.success('Environment secrets saved!');
            }}
          >
            {step2Done ? 'Configured' : 'Add Secrets'}
          </Button>
        </div>

        {/* Step 3 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--pui-radius-md)',
            background: 'var(--pui-surface-subtle)',
            border: '1px solid var(--pui-border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Checkbox
              checked={step3Done}
              onChange={(e) => setStep3Done(e.target.checked)}
            />
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', textDecoration: step3Done ? 'line-through' : 'none' }}>
                Deploy First Release to Edge Network
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--pui-text-muted)' }}>
                Build and propagate container to all global POPs
              </div>
            </div>
          </div>
          <Button
            size="sm"
            variant="primary"
            onClick={() => {
              setStep3Done(true);
              toast.success('Deployment dispatched to cluster!');
            }}
          >
            {step3Done ? 'Deployed' : 'Deploy Now'}
          </Button>
        </div>
      </div>
    </Card>
  );
}

/* ---------------------------------------------------------------- Page Component */

export function BlocksPage() {
  return (
    <DocPage
      eyebrow="Templates & Blocks"
      title="Production Blocks"
      lede="Turnkey, copy-paste ready application blocks. Assembled with polished token-driven theming, validation, mobile responsiveness, and zero external dependencies."
    >
      <Section
        title="1. Authentication Card Block (block-auth)"
        description="Clean tabbed login & register card with social OAuth, password strength meter, remember-me toggles, and async submission."
      >
        <Showcase code="<BlockAuth />" defaultOpen width="md">
          <BlockAuth />
        </Showcase>
      </Section>

      <Section
        title="2. Executive KPI Metrics Grid (block-metrics)"
        description="4-column responsive performance grid with percentage trends, delta indicators, and embedded lightweight SVG sparklines."
      >
        <Showcase code="<BlockMetrics />" defaultOpen width="full">
          <BlockMetrics />
        </Showcase>
      </Section>

      <Section
        title="3. Account & Workspace Settings Block (block-settings)"
        description="Two-column responsive settings layout with avatar dropzone, role selectors, system switches, and promise-based toast notifications."
      >
        <Showcase code="<BlockSettings />" defaultOpen width="lg">
          <BlockSettings />
        </Showcase>
      </Section>

      <Section
        title="4. Admin CRUD Data Table Block (block-table)"
        description="Search filter bar, multi-row selection, bulk action triggers, integrated footer pagination, and one-click CSV export."
      >
        <Showcase code="<BlockCrudTable />" defaultOpen width="full">
          <BlockCrudTable />
        </Showcase>
      </Section>
      <Section
        title="5. SaaS Pricing Tier Matrix (block-pricing)"
        description="Responsive multi-card tier selector with annual discount switch, popular tier highlight glow, and feature checklists."
      >
        <Showcase code="<BlockPricing />" defaultOpen width="full">
          <BlockPricing />
        </Showcase>
      </Section>

      <Section
        title="6. Workspace Setup & Onboarding Checklist (block-onboarding)"
        description="Clean empty state onboarding card with interactive step checklist, completion percentage tracker, and action triggers."
      >
        <Showcase code="<BlockEmptyStateOnboarding />" defaultOpen width="lg">
          <BlockEmptyStateOnboarding />
        </Showcase>
      </Section>
    </DocPage>
  );
}
