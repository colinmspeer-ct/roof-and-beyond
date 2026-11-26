import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { MobileActionBar } from "@/components/mobile-action-bar";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader, TopBar } from "@/components/site-header";
import { brand, socialImage } from "@/content/brand";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
  adjustFontFallback: true,
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(brand.url),
  title: {
    default: `${brand.dba} | Roofs, walls, and gutters in five Pennsylvania counties`,
    template: `%s | ${brand.dba}`,
  },
  description: brand.description,
  icons: {
    icon: [32, 192, 512].map((size) => ({
      url: `/brand/icon-${size}.png`, sizes: `${size}x${size}`, type: "image/png",
    })),
    apple: { url: "/brand/icon-180.png", sizes: "180x180", type: "image/png" },
  },
  applicationName: brand.dba,
  openGraph: {
    type: "website",
    siteName: brand.dba,
    locale: "en_US",
    title: {
      default: `${brand.dba} | Roofs, walls, and gutters in five Pennsylvania counties`,
      template: `%s | ${brand.dba}`,
    },
    description: brand.description,
    images: [socialImage],
  },
  twitter: {
    card: "summary_large_image",
    images: [socialImage.url],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-orange focus:px-3 focus:py-2 focus:font-bold focus:text-navy"
        >
          Skip to content
        </a>
        <TopBar />
        <SiteHeader />
        <div id="content" className="flex-1 pb-24 md:pb-0">
          {children}
        </div>
        <SiteFooter />
        <MobileActionBar />
      </body>
    </html>
  );
}
