import type { Metadata } from 'next';
import PrivacyContent from '@/app/components/PrivacyContent';

export const metadata: Metadata = {
  title: 'Privacy policy and GDPR',
  description:
    'How ClickRunClaw collects, stores and deletes personal data, where it is hosted, and the rights available to you under the GDPR.',
  alternates: { canonical: '/privacy' },
  openGraph: {
    title: 'Privacy policy and GDPR | ClickRunClaw',
    description:
      'Data collection, legal basis, retention and your rights under the GDPR.',
    url: 'https://clickrunclaw.com/privacy',
  },
};

export default function PrivacyPage() {
  return <PrivacyContent />;
}
