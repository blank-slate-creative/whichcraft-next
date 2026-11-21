import localFont from 'next/font/local';
import { ThemeProvider } from 'next-themes';
import Navbar from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import './globals.css';

// Bricolage Grotesque, SIL Open Font License 1.1 (licence beside the file in app/fonts/OFL.txt).
// The file is the variable font with its width pinned at 88% (the brand guide's "about 88% width"),
// weight 700 to 800 and optical size kept; app/fonts/README.md says how it was made. It is served
// from this site, so no request goes to a font host at runtime.
const display = localFont({
  src: './fonts/BricolageGrotesque-latin-display.woff2',
  weight: '700 800',
  display: 'swap',
  variable: '--font-display',
});

const SITE_URL = 'https://whichcraft.beer';
const TITLE = 'WhichCraft: a private beer tracker for iPhone';
const DESCRIPTION =
  'WhichCraft is an iPhone app for logging the beers you try and remembering the ones you liked. Private, with no ads. Download it on the App Store.';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    type: 'website',
    siteName: 'WhichCraft',
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
};

// Pinch-zoom stays on (WCAG 1.4.4): the old viewport turned it off, which Lighthouse flagged.
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FBF1E0' },
    { media: '(prefers-color-scheme: dark)', color: '#1D110B' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={display.variable} suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-title" content="WhichCraft" />
      </head>
      <body className="flex min-h-dvh flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
