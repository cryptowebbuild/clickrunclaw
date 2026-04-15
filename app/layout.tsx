import type {Metadata} from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' });

export const metadata: Metadata = {
  title: 'ClickRunClaw | 1-Click OpenClaw AI Agent Deployment & Hosting',
  description: 'The ultimate platform to host and deploy OpenClaw AI agents. Secure cloud instances, BYOK architecture, and instant Telegram/Discord integration.',
  keywords: ['OpenClaw', 'AI Agent Hosting', 'Deploy OpenClaw', 'AI VPS', 'Docker AI', 'ClickRunClaw', 'LLM Hosting', 'Autonomous Agents'],
  authors: [{ name: 'ClickRunClaw' }],
  creator: 'ClickRunClaw',
  publisher: 'ClickRunClaw',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'ClickRunClaw | 1-Click OpenClaw AI Agent Deployment & Hosting',
    description: 'The ultimate platform to host and deploy OpenClaw AI agents. Secure cloud instances, BYOK architecture, and instant Telegram/Discord integration.',
    url: 'https://clickrunclaw.com',
    siteName: 'ClickRunClaw',
    images: [
      {
        url: 'https://clickrunclaw.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ClickRunClaw Platform Preview',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ClickRunClaw | 1-Click OpenClaw AI Agent Hosting',
    description: 'Deploy OpenClaw and other AI agents in 30 seconds. No terminal required.',
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
  }
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-black text-white antialiased selection:bg-purple-500/30 font-sans" suppressHydrationWarning>
        {/* JSON-LD Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "ClickRunClaw",
              "applicationCategory": "DeveloperApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "9.00",
                "priceCurrency": "USD"
              },
              "description": "1-click isolated cloud hosting platform for AI agents like OpenClaw. Deploy in 30 seconds with no terminal required.",
              "url": "https://clickrunclaw.com"
            })
          }}
        />
        {children}
      </body>
    </html>
  );
}
