import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'Verified Care - NDIS Provider Marketplace',
    template: '%s | Verified Care',
  },
  description:
    'Connect with verified NDIS providers for domestic cleaning, community transport, and yard maintenance. Fair pricing, transparent service.',
  keywords: [
    'NDIS',
    'disability support',
    'NDIS providers',
    'domestic cleaning',
    'community transport',
    'yard maintenance',
    'Australia',
    'disability services',
  ],
  authors: [{ name: 'Verified Care' }],
  creator: 'Verified Care',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    siteName: 'Verified Care',
    title: 'Verified Care - NDIS Provider Marketplace',
    description: 'Connect with verified NDIS providers. Fair pricing, transparent service.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Verified Care - NDIS Provider Marketplace',
    description: 'Connect with verified NDIS providers. Fair pricing, transparent service.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#2D5A4A',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
