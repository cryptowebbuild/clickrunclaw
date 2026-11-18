import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Analytics from './components/Analytics';
import { SITE } from '@/lib/site';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space', display: 'swap' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

export const viewport: Viewport = {
  themeColor: '#090A0F',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: 'ClickRunClaw | EU-First AI Automation Agency & Custom AI Agents',
  description: SITE.description,
  keywords: [
    'AI automation agency',
    'custom AI agents',
    'EU AI automation',
    'sovereign AI infrastructure',
    'workflow automation',
    'autonomous agents',
    'GDPR compliant AI',
    'ClickRunClaw',
  ],
  authors: [{ name: SITE.founder, url: SITE.studioUrl }],
  creator: SITE.founder,
  publisher: SITE.legalName,
  category: 'technology',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'ClickRunClaw | EU-First AI Automation Agency',
    description:
      'Custom AI agents and sovereign workflow automations for European businesses. Fixed price, 100% async delivery, dedicated EU infrastructure from $799.',
    url: SITE.url,
    siteName: SITE.name,
    locale: 'en_GB',
    type: 'website',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'ClickRunClaw, EU-first AI automation agency',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ClickRunClaw | EU-First AI Automation Agency',
    description:
      'Custom AI agents and sovereign workflow automations. Fixed price, 100% async delivery, dedicated EU infrastructure from $799.',
    images: ['/og.png'],
    site: '@clickrunclaw',
    creator: '@clickrunclaw',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  alternates: {
    types: {
      'application/rss+xml': '/feed.xml',
    },
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${SITE.url}/#organization`,
  name: SITE.name,
  legalName: SITE.legalName,
  description: SITE.description,
  url: SITE.url,
  logo: `${SITE.url}/icon.png`,
  image: `${SITE.url}/og.png`,
  email: SITE.email,
  founder: { '@type': 'Person', name: SITE.founder },
  parentOrganization: { '@type': 'Organization', name: SITE.studio, url: SITE.studioUrl },
  priceRange: '$799 - $3,499+',
  currenciesAccepted: 'USD',
  paymentAccepted: 'Credit card, wire transfer',
  areaServed: ['European Union', 'United Kingdom', 'Switzerland', 'Norway'],
  knowsAbout: [
    'AI agent development',
    'Workflow automation',
    'Invoice reconciliation',
    'Customer support automation',
    'GDPR compliant infrastructure',
  ],
  sameAs: [SITE.social.x, SITE.social.facebook, SITE.social.telegram, SITE.social.github],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'AI Automation Packages',
    itemListElement: [
      {
        '@type': 'Offer',
        name: 'Starter Agent Package',
        price: '799',
        priceCurrency: 'USD',
        description:
          'Single-workflow custom AI agent with a live sandbox preview and a dedicated EU container.',
      },
      {
        '@type': 'Offer',
        name: 'Growth Funnel Automation',
        price: '1799',
        priceCurrency: 'USD',
        description:
          'Multi-step agent pipeline with CRM integration and server-side conversion tracking.',
      },
      {
        '@type': 'Offer',
        name: 'Full AI Partner',
        price: '3499',
        priceCurrency: 'USD',
        description:
          'Full-stack autonomous systems, custom model routing and ongoing maintenance.',
      },
    ],
  },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE.url}/#website`,
  url: SITE.url,
  name: SITE.name,
  publisher: { '@id': `${SITE.url}/#organization` },
  inLanguage: 'en',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
      style={{ colorScheme: 'dark' }}
    >
      <body className="min-h-screen bg-[#090A0F] font-sans text-zinc-100 antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-[#FF5A5F] focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-white"
        >
          Skip to content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([organizationSchema, websiteSchema]) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
