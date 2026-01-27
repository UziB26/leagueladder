import type { Metadata, Viewport } from "next";
import "./globals.css";

// Use system fonts as fallback to avoid build-time network dependencies
// Google Fonts will be loaded at runtime if available
let geistSans: { variable: string } = { variable: "" };
let geistMono: { variable: string } = { variable: "" };

try {
  // Try to load Google Fonts, but don't fail build if network is unavailable
  const { Geist, Geist_Mono } = require("next/font/google");
  geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
    display: "swap",
    fallback: ["system-ui", "arial"],
    adjustFontFallback: true,
  });
  
  geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
    display: "swap",
    fallback: ["Consolas", "Monaco", "monospace"],
    adjustFontFallback: true,
  });
} catch (error) {
  // If fonts fail to load, use empty variables (will fall back to system fonts via CSS)
  console.warn("Google Fonts unavailable, using system fonts:", error);
  geistSans = { variable: "" };
  geistMono = { variable: "" };
}
import { AuthProvider } from "@/components/auth/auth-provider";
import { Navigation } from "@/components/layout/navigation";
import { PageTransition } from "@/components/ui/page-transition";
import { PWAInstaller } from "@/components/pwa/pwa-installer";
import { PWAInitializer } from "@/components/pwa/pwa-initializer";
import { ViewportManager } from "@/components/viewport/viewport-manager";
import { ViewportMeta } from "@/components/viewport/viewport-meta";
import { OnboardingWrapper } from "@/components/onboarding/onboarding-wrapper";

// Configure fonts with fallbacks and error handling
// If Google Fonts fail to load, we'll use system fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  fallback: ["system-ui", "arial"],
  adjustFontFallback: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  fallback: ["Consolas", "Monaco", "monospace"],
  adjustFontFallback: true,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  // Prevent zoom on input focus (iOS)
  interactiveWidget: "resizes-content",
  themeColor: "#2563eb",
};

export const metadata: Metadata = {
  title: "League Ladder",
  description: "Table Tennis & FIFA leagues with Elo rankings",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "League Ladder",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >
        <div className="min-h-screen">
          <ViewportMeta />
          <ViewportManager />
          <AuthProvider>
            <Navigation />
            <PageTransition>
              {children}
            </PageTransition>
            <PWAInstaller />
            <PWAInitializer />
            <OnboardingWrapper />
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
