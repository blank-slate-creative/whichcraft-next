import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Navbar from "@/components/Navbar";
import "./globals.css";

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export const metadata = {
  title: "WhichCraft",
  description: "WhichCraft App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col items-center">
            <Navbar />
            <div className="flex-1 w-full flex flex-col items-center">
              <div className="flex flex-col max-w-5xl p-5">{children}</div>
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
