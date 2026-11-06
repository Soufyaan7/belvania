import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: {
    default: "Belvania Store | Parfums & Maquillage 100% Originaux",
    template: "%s | Belvania Store",
  },
  description:
    "Boutique de prestige dédiée aux parfums rares et maquillage haute couture 100% authentiques. Livraison express partout au Maroc et paiement en espèces à la livraison (COD).",
  keywords: [
    "parfums originaux",
    "maquillage de luxe",
    "parfum 10ml voyage",
    "paiement à la livraison maroc",
    "Carolina Herrera",
    "Yves Saint Laurent Libre",
    "Nars Orgasm",
    "Huda Beauty",
    "Belvania Store",
  ],
  authors: [{ name: "Belvania Store" }],
  creator: "Belvania Store",
  metadataBase: new URL("https://belvaniastore.com"),
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://belvaniastore.com",
    siteName: "Belvania Store",
    title: "Belvania Store | Parfums & Maquillage 100% Originaux",
    description:
      "Boutique de prestige dédiée aux parfums rares et maquillage haute couture 100% authentiques. Livraison express et paiement à la réception (COD).",
    images: [
      {
        url: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Belvania Store - Parfums & Maquillage Originaux",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Belvania Store | Parfums & Maquillage 100% Originaux",
    description:
      "Boutique de prestige dédiée aux parfums rares et maquillage haute couture 100% authentiques. Paiement à la réception (COD).",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased overflow-x-hidden`}
    >
      <head>
        <script
          type="speculationrules"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              prerender: [
                {
                  source: 'document',
                  where: {
                    and: [
                      { href_matches: '/*' },
                      { not: { href_matches: '/api/*' } },
                      { not: { href_matches: '*/panier' } },
                      { not: { href_matches: '*/thank-you*' } },
                      { not: { href_matches: '*/checkout*' } },
                      { not: { selector_matches: '[data-no-prerender]' } },
                    ],
                  },
                  eagerness: 'moderate',
                },
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#FAF8F5] text-[#1A1A1A] overflow-x-hidden">
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
