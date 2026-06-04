import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { CustomCursor } from "@/components/CustomCursor";
import { CartDrawer } from "@/components/store/CartDrawer";
import { Header } from "@/components/store/Header";
import { PWARegister } from "@/components/PWARegister";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AURA - Premium Tech Ecommerce",
  description: "Experience the future of digital luxury commerce, powered by AURA. Engineered for speed, credibility, and impact.",
  metadataBase: new URL("http://localhost:3000"),
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AURA Store",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aura.co",
    title: "AURA - Premium Tech Ecommerce",
    description: "The ultimate dark luxury tech commerce platform.",
    siteName: "AURA",
  },
  twitter: {
    card: "summary_large_image",
    title: "AURA",
    description: "The ultimate dark luxury tech commerce platform.",
  },
};

export const viewport: Viewport = {
  themeColor: "#050508",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${inter.variable} ${jetbrains.variable} font-sans antialiased text-text-primary bg-void`}
      >
        <Providers>
          <div className="film-grain min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">{children}</main>
            <CartDrawer />
          </div>
          <CustomCursor />
          <PWARegister />
        </Providers>
      </body>
    </html>
  );
}
