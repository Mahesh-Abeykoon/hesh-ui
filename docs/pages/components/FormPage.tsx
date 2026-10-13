import { useState } from 'react';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  Input,
  Select,
  Textarea,
  Button,
  Card,
  Checkbox,
  toast,
} from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const BASIC_FORM_DEMO = `import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  Input,
  Select,
  Textarea,
  Button,
  Checkbox,
  toast,
} from 'hesh-ui';

function ContactForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = String(data.get('email') || '');
    const newErrors: Record<string, string> = {};

    if (!email.includes('@')) {
      newErrors.email = 'Please enter a valid business email address.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setSubmitting(true);
      setTimeout(() => {
        setSubmitting(false);
        toast.success('Inquiry submitted!', 'We will get back to you within 24 hours.');
      }, 900);
    }
  };

  return (
    <Form onSubmit={handleSubmit} autoFocusError>
      <FormField name="fullName">
        <FormItem>
          <FormLabel required>Full Name</FormLabel>
          <FormControl>
            <Input name="fullName" placeholder="Sarah Connor" required />
          </FormControl>
        </FormItem>
      </FormField>

      <FormField name="email" error={errors.email}>
        <FormItem error={errors.email}>
          <FormLabel required>Business Email</FormLabel>
          <FormControl>
            <Input name="email" type="email" placeholder="sarah@cyberdyne.ai" required />
          </FormControl>
          <FormDescription>We never share your corporate email.</FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>

      <Button type="submit" loading={submitting}>Submit Inquiry</Button>
    </Form>
  );
}`;

const RHF_ZOD_RECIPE = `// Industry-Standard Recipe: React Hook Form + Zod
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, Input, Button } from 'hesh-ui';

const profileSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
});

export function ProfileForm() {
  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { username: '', email: '' },
  });

  const onSubmit = (values: z.infer<typeof profileSchema>) => {
    toast.success(\`Profile updated for \${values.username}\`);
  };

  return (
    <Form onSubmit={form.handleSubmit(onSubmit)}>
      <FormField
        name="username"
        error={form.formState.errors.username?.message}
        render={({ field }) => (
          <FormItem error={form.formState.errors.username?.message}>
            <FormLabel required>Username</FormLabel>
            <FormControl>
              <Input {...field} placeholder="johndoe" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <Button type="submit">Save Profile</Button>
    </Form>
  );
}`;

export function FormPage() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = String(data.get('email') || '');
    const message = String(data.get('message') || '');
    const newErrors: Record<string, string> = {};

    if (!email || !email.includes('@')) {
      newErrors.email = 'Please enter a valid business email address.';
    }
    if (!message || message.length < 10) {
      newErrors.message = 'Please provide at least 10 characters detailing your request.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setSubmitting(true);
      setTimeout(() => {
        setSubmitting(false);
        toast.success('Inquiry submitted!', 'Our solutions team will reach out shortly.');
      }, 1000);
    } else {
      toast.error('Validation failed', 'Please review the highlighted fields.');
    }
  };

  return (
    <DocPage
      eyebrow="Forms & Inputs"
      title="Form"
      lede="Turnkey form container with automatic accessible ARIA wiring, seamless React Hook Form compatibility, inline error messaging, and auto-focus on invalid submission."
      importStatement="import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from 'hesh-ui';"
    >
      <Section
        title="Interactive Form Validation Showcase"
        description="Try submitting an invalid email or short message to see automatic error announcements and focus management in action."
      >
        <Showcase code={BASIC_FORM_DEMO} defaultOpen width="md">
          <Card padded style={{ width: '100%', maxWidth: '440px' }}>
            <Form onSubmit={handleSubmit} autoFocusError>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <FormField name="fullName">
                  <FormItem>
                    <FormLabel required>Full Name</FormLabel>
                    <FormControl>
                      <Input name="fullName" placeholder="Sarah Connor" defaultValue="Sarah Connor" required />
                    </FormControl>
                  </FormItem>
                </FormField>

                <FormField name="email" error={errors.email}>
                  <FormItem error={errors.email}>
                    <FormLabel required>Business Email</FormLabel>
                    <FormControl>
                      <Input
                        name="email"
                        type="email"
                        placeholder="sarah@cyberdyne.ai"
                        defaultValue="invalid-email"
                        required
                      />
                    </FormControl>
                    <FormDescription>Corporate or team email address.</FormDescription>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <FormField name="inquiryType">
                  <FormItem>
                    <FormLabel>Project Scope</FormLabel>
                    <FormControl>
                      <Select
                        name="inquiryType"
                        options={[
                          { value: 'enterprise', label: 'Enterprise Design System' },
                          { value: 'saas', label: 'SaaS Dashboard Migration' },
                          { value: 'audit', label: 'Accessibility (WCAG) Audit' },
                        ]}
                        defaultValue="enterprise"
                      />
                    </FormControl>
                  </FormItem>
                </FormField>

                <FormField name="message" error={errors.message}>
                  <FormItem error={errors.message}>
                    <FormLabel required>Project Requirements</FormLabel>
                    <FormControl>
                      <Textarea
                        name="message"
                        rows={3}
                        placeholder="Tell us about your team size, tech stack, and timeline..."
                        defaultValue="Help"
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <Button type="submit" variant="primary" loading={submitting} style={{ marginTop: '0.5rem' }}>
                  Submit Inquiry
                </Button>
              </div>
            </Form>
          </Card>
        </Showcase>
      </Section>

      <Section
        title="React Hook Form + Zod Architecture"
        description="Connect with standard form management packages for end-to-end type safety and schema validation."
      >
        <Showcase code={RHF_ZOD_RECIPE} width="md">
          <div className="prose">
            <p>
              Hesh UI components are standard forwardRef primitives with standard event signatures (<code>onChange</code>, <code>onBlur</code>, <code>value</code>, <code>name</code>). You can wire them directly into React Hook Form controller registration with zero glue code.
            </p>
          </div>
        </Showcase>
      </Section>

      <Section title="Accessibility & Focus Management">
        <Callout tone="info" title="Automatic Invalid Focus & Announcer Linking">
          When a form submission is blocked due to validation errors, <code>&lt;Form autoFocusError&gt;</code> automatically searches for the first element with <code>aria-invalid=&quot;true&quot;</code> and shifts browser focus to it. Each error message is attached via <code>aria-describedby</code> and carries <code>role=&quot;alert&quot;</code>.
        </Callout>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'Form.autoFocusError', type: 'boolean', default: 'true', description: 'Automatically focuses the first invalid control on failed submission.' },
            { name: 'FormField.name', type: 'string', required: true, description: 'Field identification key.' },
            { name: 'FormField.error', type: 'ReactNode', description: 'Validation error message for this field.' },
            { name: 'FormField.hint', type: 'ReactNode', description: 'Helper explanation text.' },
            { name: 'FormLabel.required', type: 'boolean', default: 'false', description: 'Renders an accessible required indicator asterisk.' },
            { name: 'FormControl.children', type: 'ReactElement', required: true, description: 'Target input or control element to receive IDs and ARIA attributes.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
