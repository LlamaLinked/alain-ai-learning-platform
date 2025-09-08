import React from 'react';
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ClerkProvider, SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import "./globals.css";
import ALAINLogo from "@/components/ALAINLogo";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "ALAIN - Applied Learning AI Notebooks",
  description: "Interactive AI learning platform with real models and hands-on tutorials",
  icons: [{ rel: "icon", url: "/logo.svg" }],
  openGraph: {
    title: "ALAIN - Applied Learning AI Notebooks",
    description: "Interactive AI learning platform with real models and hands-on tutorials",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ALAIN - Applied Learning AI Notebooks",
    description: "Interactive AI learning platform with real models and hands-on tutorials",
  },
};

const inter = Inter({ subsets: ["latin"], display: "swap" });
const jbMono = JetBrains_Mono({ subsets: ["latin"], display: "swap" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className} style={{ ['--brand-primary' as any]: BRAND.colors.primary, ['--brand-accent' as any]: BRAND.colors.accent, ['--brand-spark' as any]: BRAND.colors.spark }}>
          <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:shadow">Skip to content</a>
          <header className="flex items-center justify-between gap-3 border-b bg-white/70 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <a href="/" className="flex items-center gap-2" aria-label="ALAIN home">
                <ALAINLogo size="sm" />
              </a>
              <nav aria-label="Primary" className="hidden gap-2 text-sm md:flex">
                <a className="rounded px-3 py-2 hover:bg-black/5" href="/generate">Generate</a>
                <a className="rounded px-3 py-2 hover:bg-black/5" href="/stream">Stream</a>
                <a className="rounded px-3 py-2 hover:bg-black/5" href="/tutorials">Tutorials</a>
              </nav>
            </div>
            <div className="flex items-center gap-2">
              <SignedOut>
                <SignInButton />
                <SignUpButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </header>
          <main id="main">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
