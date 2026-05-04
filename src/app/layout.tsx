import type { Metadata } from "next";
import { Inter, Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import { CartProvider } from "@/context/cart-context";
import { Toaster } from "@/components/ui/sonner";


import { ThemeProvider } from "@/components/theme-provider";
import ChatwootWidget from "@/components/chatwoot-widget";
import GlobalSeoIntegrator from "@/components/global-seo-integrator";
import { CartDrawer } from "@/components/cart-drawer";
import { WelcomePopup } from "@/components/welcome-popup";
import { AgeVerification } from "@/components/age-verification";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Sharcly",
  description: "Discover our curated collection of products. Browse our latest featured items and shop with confidence.",
  icons: {
    icon: "https://cdn.mignite.app/ws/works_01KM0WR2ZSKYNHV0ZE2MPNM9EF/final-Logo-1--01KM5Y2NCW8720B30G9G0XW18Y.png",
  }
};

import { ReduxProvider } from "@/store/provider";
import { Analytics } from "@vercel/analytics/next";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>

      <body className={`${inter.variable} ${cormorant.variable} ${dmSans.variable} font-sans antialiased bg-background text-foreground`}>
        <ReduxProvider>
          <ThemeProvider>
            <CartProvider>
              <AuthProvider>
                <div className="min-h-screen flex flex-col">
                  {children}
                </div>
                <AgeVerification />
                <WelcomePopup />
                <Toaster position="top-right" />
                <CartDrawer />
                <ChatwootWidget />
                <GlobalSeoIntegrator />
                <Analytics />
              </AuthProvider>
            </CartProvider>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}

