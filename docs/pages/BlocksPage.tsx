import { useState } from 'react';
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  Checkbox,
  Combobox,
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
import {
    CheckIcon,
  ChevronDownIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
} from '../../src/index';

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
    </DocPage>
  );
}
