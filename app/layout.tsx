import type {Metadata} from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: "ClickRunClaw | 1-Click AI Agent Cloud Hosting",
  description: "Deploy and host your OpenClaw and Web3 AI agents instantly with our zero-configuration cloud infrastructure.",
  keywords: ['OpenClaw AI Agent', 'Deploy OpenClaw', 'OpenClaw Cloud Hosting', 'OpenClaw Telegram Bot', 'OpenClaw Discord Bot', 'Openclawd Alternative', 'Open Source AI Agent', 'Mac mini AI alternative', 'AI Agent Hosting', 'Run OpenClaw', 'ClickRunClaw', 'AI VPS'],
  authors: [{ name: 'ClickRunClaw' }],
  creator: 'ClickRunClaw',
  publisher: 'ClickRunClaw',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'ClickRunClaw | 1-Click AI Agent Cloud Hosting',
    description: 'Deploy and host your OpenClaw and Web3 AI agents instantly with our zero-configuration cloud infrastructure.',
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
    title: 'ClickRunClaw | 1-Click AI Agent Cloud Hosting',
    description: 'Deploy OpenClaw AI Agents in 30 seconds. No terminal, Mac mini, or Linux setups required.',
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
                "price": "9.00",
                "priceCurrency": "USD"
              },
              "description": "Deploy and host your OpenClaw and Web3 AI agents instantly with our zero-configuration cloud infrastructure.",
              "url": "https://clickrunclaw.com",
              "keywords": "openclaw, openclaw ai agent, deploy openclaw, openclaw cloud hosting, openclawd alternative"
            })
          }}
        />
        {children}
      </body>
    </html>
  );
}
