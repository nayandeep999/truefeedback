import type { Metadata, Viewport } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import AuthProvider from "@/context/authProvider";
import { Toaster } from "@/components/ui/toaster";
import { siteConfig } from "@/config/site";
import { Providers } from "@/components/providers";
import Navbar from "@/components/navbar";
import NextTopLoader from "nextjs-toploader";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? siteConfig.url),
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <NextTopLoader />
          <Providers>
            <div className="relative flex flex-col min-h-dvh bg-background">
              <Navbar />
              <div className="flex-1">{children}</div>
              <Toaster />
            </div>
          </Providers>
        </body>
      </AuthProvider>
    </html>
  );
}
