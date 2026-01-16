import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/auth-provider";
import { Navigation } from "@/components/layout/navigation";
import { PageTransition } from "@/components/ui/page-transition";
import { PWAInstaller } from "@/components/pwa/pwa-installer";
import { PWAInitializer } from "@/components/pwa/pwa-initializer";
import { ViewportManager } from "@/components/viewport/viewport-manager";
import { ViewportMeta } from "@/components/viewport/viewport-meta";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "League Ladder",
  description: "Table Tennis & FIFA leagues with Elo rankings",
  manifest: "/manifest.json",
  themeColor: "#2563eb",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "League Ladder",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: "cover",
    // Prevent zoom on input focus (iOS)
    interactiveWidget: "resizes-content",
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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
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
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
