import { Space_Grotesk } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-space-grotesk',
});

export const metadata = {
  title: 'WhichCraft',
  description: 'WhichCraft App',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={spaceGrotesk.className} suppressHydrationWarning>
      <body className="bg-background text-foreground flex flex-col h-screen overflow-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-5xl mx-auto px-2 sm:px-3 md:px-4 py-4">{children}</div>
          </main>
          <BottomNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
