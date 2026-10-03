import type { Metadata } from 'next';
import Script from 'next/script';
import { cookies, headers } from 'next/headers';
import { DM_Sans, IBM_Plex_Mono, Source_Serif_4 } from 'next/font/google';
import './globals.css';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github-dark.css';
import PwaRegister from '@/components/PwaRegister';
import { THEME_EARLY_APPLY_SCRIPT } from '@/lib/theme';
import ThemeRuntime from '@/components/ThemeRuntime';
import { I18nProvider } from '@/lib/i18n/provider';
import { LOCALE_COOKIE, htmlLang } from '@/lib/i18n/config';
import { detectLocaleFromHints } from '@/lib/i18n/detectLocale';

const dmSans = DM_Sans({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
});

const sourceSerif4 = Source_Serif_4({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-source-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Synapse',
  description: 'Markdown vaults linked to Myelin',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'Synapse',
    statusBarStyle: 'black-translucent',
  },
  icons: {
    icon: [
      {
        url: '/favicon-light.png',
        type: 'image/png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/favicon-dark.png',
        type: 'image/png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/favicon.png',
        type: 'image/png',
      },
      {
        url: '/icon-192.png',
        type: 'image/png',
        sizes: '192x192',
      },
      {
        url: '/icon-512.png',
        type: 'image/png',
        sizes: '512x512',
      },
    ],
    apple: [
      {
        url: '/apple-touch-icon-light.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/apple-touch-icon-dark.png',
        media: '(prefers-color-scheme: dark)',
      },
    ],
  },
};

export const viewport = {
  themeColor: '#0a0e13',
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const hdrs = await headers();
  const locale = detectLocaleFromHints(
    cookieStore.get(LOCALE_COOKIE)?.value,
    String(
      hdrs.get('cf-ipcountry') ||
        hdrs.get('x-country-code') ||
        hdrs.get('x-vercel-ip-country') ||
        ''
    ),
    String(hdrs.get('accept-language') || '')
  );

  return (
    <html
      lang={htmlLang(locale)}
      data-theme-palette="synapse"
      data-theme-mode="system"
      className={`${dmSans.variable} ${ibmPlexMono.variable} ${sourceSerif4.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen antialiased">
        <Script id="theme-early" strategy="beforeInteractive">
          {THEME_EARLY_APPLY_SCRIPT}
        </Script>
        {/* Self-host Excalidraw fonts (public/excalidraw) — avoid esm.sh CDN fetches. */}
        <Script id="excalidraw-asset-path" strategy="beforeInteractive">
          {`window.EXCALIDRAW_ASSET_PATH="/excalidraw/";`}
        </Script>
        <ThemeRuntime />
        <PwaRegister />
        <I18nProvider initialLocale={locale}>{children}</I18nProvider>
      </body>
    </html>
  );
}
