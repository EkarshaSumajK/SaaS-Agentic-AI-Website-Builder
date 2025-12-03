import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TRPCReactProvider } from "@/trpc/client";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import { ThemeAwareClerkProvider } from "@/components/theme-aware-clerk-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lumina - AI Website Builder",
  description: "Build modern websites with AI assistance",
  icons: {
    icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTA3Fm3ZqSqSdlph2paINM75OWLtKgBh5mM4w&s",
  },
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
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ThemeAwareClerkProvider>
            <TRPCReactProvider>
              <Toaster />
              {children}
            </TRPCReactProvider>
          </ThemeAwareClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
