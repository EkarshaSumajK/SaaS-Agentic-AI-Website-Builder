import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TRPCReactProvider } from "@/trpc/client";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import { ThemeAwareClerkProvider } from "@/components/theme-aware-clerk-provider";
import { GlobalErrorBoundary } from "@/components/global-error-boundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Lumina - AI Website Builder",
  description: "Build modern websites with AI assistance. Transform your ideas into stunning SaaS websites with the power of AI.",
  keywords: ["AI", "website builder", "SaaS", "web development", "no-code"],
  authors: [{ name: "Lumina Team" }],
  icons: {
    icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTA3Fm3ZqSqSdlph2paINM75OWLtKgBh5mM4w&s",
  },
  openGraph: {
    title: "Lumina - AI Website Builder",
    description: "Build modern websites with AI assistance",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lumina - AI Website Builder",
    description: "Build modern websites with AI assistance",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${geistMono.className} antialiased`}
        suppressHydrationWarning
      >
        <GlobalErrorBoundary>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <ThemeAwareClerkProvider>
              <TRPCReactProvider>
                <Toaster />
                {children}
              </TRPCReactProvider>
            </ThemeAwareClerkProvider>
          </ThemeProvider>
        </GlobalErrorBoundary>
      </body>
    </html>
  );
}
