import type { Metadata } from 'next';
import HomeContent from './components/HomeContent';

export const metadata: Metadata = {
  title: 'ClickRunClaw | EU-First AI Automation Agency & Custom AI Agents',
  description:
    'Custom AI agents, workflow automations and sovereign AI pipelines for European businesses. Fixed price, 100% async delivery, dedicated EU infrastructure from $799.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'ClickRunClaw | EU-First AI Automation Agency',
    description:
      'Custom AI agents and sovereign workflow automations for European businesses. Fixed price, 100% async delivery, dedicated EU hardware from $799.',
    url: 'https://clickrunclaw.com',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'ClickRunClaw, EU-first AI automation agency',
      },
    ],
  },
};

const faqs = [
  {
    q: 'Where is customer and workflow data hosted?',
    a: 'All ClickRunClaw production infrastructure runs on dedicated hardware in Frankfurt, Germany and Helsinki, Finland. Client data is isolated in dedicated containers and is never used to train foundation models. Clients that need full sovereign inference can route through Mistral EU endpoints.',
  },
  {
    q: 'Why is delivery 100% async with no phone or video meetings?',
    a: 'A structured written brief captures the workflow, the integrations and the logic rules more precisely than a call, and it leaves a record both sides can check. Within 24 to 48 hours you receive a written architecture and a sandbox preview you can test in the browser.',
  },
  {
    q: 'How does the 7-day launch timeline work?',
    a: 'Day 1: brief review and written architecture confirmed. Days 2 to 4: build, integrations and prompt tuning. Days 5 and 6: staging sandbox, your review, edge-case fixes. Day 7: production deployment on dedicated EU infrastructure with monitoring enabled.',
  },
  {
    q: 'Who owns the code, workflows and prompts?',
    a: 'You do, entirely. All custom code, workflows, prompt templates and integration scripts are yours on handover, with repository access and a complete export. There is no vendor lock-in.',
  },
  {
    q: 'What does the monthly retainer cover?',
    a: 'Dedicated EU hosting, automated backups, security patching, 24/7 uptime monitoring, third-party API maintenance and prompt adjustments when a model changes. New workflows are quoted separately.',
  },
  {
    q: 'Which third-party tools can you integrate?',
    a: 'Any tool with an API or webhook: HubSpot, Pipedrive, Salesforce, Zendesk, Shopify, PostgreSQL, Google Sheets, Airtable, Slack, Telegram, WhatsApp Business, Resend, Zoho and custom REST backends.',
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'AI agent development and workflow automation',
  provider: { '@id': 'https://clickrunclaw.com/#organization' },
  areaServed: ['European Union', 'United Kingdom', 'Switzerland', 'Norway'],
  offers: [
    {
      '@type': 'Offer',
      name: 'Starter Automation',
      price: '799',
      priceCurrency: 'USD',
      description: 'One production AI agent for support or sales triage, live in seven days.',
    },
    {
      '@type': 'Offer',
      name: 'Growth Funnel',
      price: '1799',
      priceCurrency: 'USD',
      description: 'Multi-step inbound pipeline with CRM sync and server-side conversion tracking.',
    },
    {
      '@type': 'Offer',
      name: 'Full AI Partner',
      price: '3499',
      priceCurrency: 'USD',
      description: 'Multi-agent document extraction and reconciliation with human review gates.',
    },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([faqSchema, serviceSchema]) }}
      />
      <HomeContent />
    </>
  );
}
