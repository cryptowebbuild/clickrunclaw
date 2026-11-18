import type { Metadata } from 'next';
import SecurityContent from '@/app/components/SecurityContent';

export const metadata: Metadata = {
  title: 'EU security architecture and data residency',
  description:
    'The infrastructure behind every ClickRunClaw build: dedicated German and Finnish containers, encryption at rest, no model training on client data, and an auditable handover.',
  alternates: { canonical: '/security' },
  openGraph: {
    title: 'EU security architecture | ClickRunClaw',
    description:
      'Dedicated EU containers, encryption at rest and a documented handover for every build.',
    url: 'https://clickrunclaw.com/security',
  },
};

export default function SecurityPage() {
  return <SecurityContent />;
}
