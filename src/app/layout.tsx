import type { Metadata } from "next";
import { Fjalla_One, Montserrat } from "next/font/google";
import { MobileActionBar } from "@/components/mobile-action-bar";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { brand, socialImage } from "@/content/brand";
import "./globals.css";

const fjalla = Fjalla_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-fjalla",
  display: "optional",
  adjustFontFallback: true,
  preload: false,
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-montserrat",
  display: "optional",
  adjustFontFallback: true,
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(brand.url),
  title: {
    default: `${brand.dba} | Roofs, walls, and gutters in four Pennsylvania counties`,
    template: `%s | ${brand.dba}`,
  },
  description: brand.description,
  applicationName: brand.dba,
  openGraph: {
    type: "website",
    siteName: brand.dba,
    locale: "en_US",
    title: {
      default: `${brand.dba} | Roofs, walls, and gutters in four Pennsylvania counties`,
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
    <html lang="en" className={`${fjalla.variable} ${montserrat.variable}`}>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-orange focus:px-3 focus:py-2 focus:text-navy"
        >
          Skip to content
        </a>
        <SiteHeader />
        <div id="content" className="flex-1 pb-20 md:pb-0">
          {children}
        </div>
        <SiteFooter />
        <MobileActionBar />
      </body>
    </html>
  );
}
