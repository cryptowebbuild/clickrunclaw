import type {Metadata} from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  metadataBase: new URL('https://clickrunclaw.com'),
  title: "ClickRunClaw | The #1 OpenClaw AI Agent Cloud Hosting",
  description: "Deploy, run, and scale OpenClaw AI agents in 1-click. Stop local hosting—use ClickRunClaw for 24/7 uptime, secure webhooks, and instant Telegram/Discord integration.",
  keywords: ['OpenClaw', 'AI Agent Hosting', '1-Click OpenClaw Deployment', 'Cloud Infrastructure for Agents', 'OpenClaw AI', 'OpenClaw Agent', 'Deploy OpenClaw', 'ClickRunClaw'],
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
    title: 'ClickRunClaw | The #1 OpenClaw AI Agent Hosting',
    description: 'Deploy, run, and scale OpenClaw AI agents in 1-click. Stop local hosting—use ClickRunClaw for 24/7 uptime.',
    url: 'https://clickrunclaw.com',
    siteName: 'ClickRunClaw',
    images: [
      {
        url: 'https://clickrunclaw.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Deploy OpenClaw AI Agents with ClickRunClaw Cloud Hosting',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ClickRunClaw | Host OpenClaw Agents in 1 Second',
    description: 'Deploy OpenClaw AI Agents in 1 second. No terminal, Mac mini, or Linux setups required.',
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
      <body className="bg-[#FAFAFA] dark:bg-[#090A0F] text-zinc-900 dark:text-zinc-100 antialiased selection:bg-coral selection:text-white font-sans" suppressHydrationWarning>
        {/* JSON-LD Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "ClickRunClaw - OpenClaw Cloud Hosting",
              "applicationCategory": "DeveloperApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "9.99",
                "priceCurrency": "USD"
              },
              "description": "Deploy and host your OpenClaw and Web3 AI agents instantly with our zero-configuration cloud infrastructure.",
              "url": "https://clickrunclaw.com",
              "keywords": "openclaw, openclaw ai agent, deploy openclaw, openclaw cloud hosting, openclaw alternative"
            })
          }}
        />
        {/* Crisp Live Chat Script */}
        <script type="text/javascript" dangerouslySetInnerHTML={{
          __html: `window.$crisp=[];window.CRISP_WEBSITE_ID="8d6eee13-c0a2-4089-85fd-9757256fac32";(function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();`
        }} />
        {children}
      </body>
    </html>
  );
}
