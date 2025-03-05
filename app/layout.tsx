import { Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-space-grotesk",
});

export const metadata = {
  title: "WhichCraft",
  description: "WhichCraft App",
};

export const viewport = {
  width: "device-width",
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
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="min-h-screen flex flex-col items-center pt-16">
            <div className="flex-1 w-full flex flex-col items-center pb-16 md:pb-0">
              <div className="w-full flex flex-col max-w-5xl px-3 sm:px-4 md:px-5">
                {children}
              </div>
            </div>
            <BottomNav />
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
