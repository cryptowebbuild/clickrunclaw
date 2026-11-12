import type {Metadata} from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  metadataBase: new URL('https://clickrunclaw.com'),
  title: "ClickRunClaw | EU-First AI Automation Agency & Custom AI Agents",
  description: "Custom AI agents, workflow automations, and sovereign AI pipelines for European and international businesses. 100% async delivery, zero meetings, dedicated EU infrastructure from $799.",
  keywords: ['AI Automation Agency', 'Custom AI Agents', 'EU AI Automation', 'Sovereign AI Infrastructure', 'Workflow Automation', 'Autonomous Agents', 'GDPR Compliant AI', 'ClickRunClaw'],
  authors: [{ name: 'ClickRunClaw' }],
  creator: 'ClickRunClaw',
  publisher: 'ClickRunClaw',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: 'https://clickrunclaw.com',
  },
  openGraph: {
    title: 'ClickRunClaw | EU-First AI Automation Agency',
    description: 'Custom AI agents and sovereign workflow automations for European businesses. 100% async delivery, zero meetings, dedicated EU infrastructure from $799.',
    url: 'https://clickrunclaw.com',
    siteName: 'ClickRunClaw',
    images: [
      {
        url: 'https://clickrunclaw.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ClickRunClaw EU-First AI Automation Agency',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ClickRunClaw | EU-First AI Automation Agency',
    description: 'Custom AI agents and sovereign workflow automations. 100% async delivery, zero meetings, dedicated EU infrastructure from $799.',
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
    icon: '/favicon.webp',
    apple: '/favicon.webp',
  }
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`} style={{ colorScheme: 'dark' }}>
      <body className="bg-[#090A0F] text-zinc-100 antialiased selection:bg-[#FF5A5F] selection:text-white font-sans" suppressHydrationWarning>
        {/* Google Analytics */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-DVW4J1GF1L"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-DVW4J1GF1L');
          `}
        </Script>

        {/* JSON-LD Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "ProfessionalService",
                "name": "ClickRunClaw",
                "legalName": "ClickRunClaw",
                "description": "EU-First AI automation agency building production custom agents, workflow integrations, and sovereign AI pipelines for European and international businesses. 100% async delivery with zero meetings.",
                "url": "https://clickrunclaw.com",
                "logo": "https://clickrunclaw.com/favicon.webp",
                "email": "support@clickrunclaw.com",
                "priceRange": "$799 - $3,499+",
                "currenciesAccepted": "USD",
                "paymentAccepted": "Credit Card, Wire Transfer, Crypto",
                "hasOfferCatalog": {
                  "@type": "OfferCatalog",
                  "name": "AI Automation Packages",
                  "itemListElement": [
                    {
                      "@type": "Offer",
                      "name": "Starter Agent Package",
                      "price": "799",
                      "priceCurrency": "USD",
                      "description": "Single-workflow custom AI agent with live interactive sandbox preview and dedicated EU container."
                    },
                    {
                      "@type": "Offer",
                      "name": "Growth Funnel Automation",
                      "price": "1799",
                      "priceCurrency": "USD",
                      "description": "Multi-step agent pipeline with CRM integration, webhook automation, and EU data isolation."
                    },
                    {
                      "@type": "Offer",
                      "name": "Full AI Partner",
                      "price": "3499",
                      "priceCurrency": "USD",
                      "description": "Full-stack autonomous systems, custom model routing, and dedicated maintenance."
                    }
                  ]
                },
                "areaServed": [
                  "European Union",
                  "Worldwide"
                ],
                "sameAs": [
                  "https://x.com/clickrunclaw",
                  "https://www.facebook.com/ClickRunClaw",
                  "https://t.me/ClickRunClaw"
                ]
              },
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "ClickRunClaw",
                "url": "https://clickrunclaw.com",
                "logo": "https://clickrunclaw.com/favicon.webp",
                "email": "support@clickrunclaw.com",
                "sameAs": [
                  "https://x.com/clickrunclaw",
                  "https://www.facebook.com/ClickRunClaw",
                  "https://t.me/ClickRunClaw"
                ]
              }
            ])
          }}
        />
        {children}
      </body>
    </html>
  );
}
