import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#0B0E0C",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://amberplains.co.ke"),
  title: {
    default: "Amber Plains Travel | Bespoke East African Safaris & Coastal Expeditions",
    template: "%s | Amber Plains Travel Mombasa",
  },
  description:
    "Mombasa-based luxury tour operator crafting private East African safaris. Experience Tsavo's red elephants, Amboseli under Kilimanjaro, and the Maasai Mara migration seamlessly connected to Kenya's Swahili coast.",
  keywords: [
    "Kenya luxury safaris",
    "Mombasa safari tour operator",
    "Bush to beach safari Kenya",
    "Tsavo East private safari",
    "Amboseli Kilimanjaro safari",
    "Maasai Mara fly in safari",
    "Diani Beach safari combinations",
    "Amber Plains Travel",
  ],
  authors: [{ name: "Amber Plains Travel Ltd" }],
  creator: "Amber Plains Travel Ltd",
  publisher: "Amber Plains Travel Ltd",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: "https://amberplains.co.ke",
    siteName: "Amber Plains Travel",
    title: "Amber Plains Travel | Luxury Bespoke East African Safaris",
    description:
      "Private tailor-made safaris connecting Mombasa and the Swahili coast to Tsavo, Amboseli, and the Maasai Mara in custom 4x4 Land Cruisers.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&h=630&q=85",
        width: 1200,
        height: 630,
        alt: "Amber Plains bespoke safari land cruiser at golden dusk on the Kenyan savanna",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Amber Plains Travel | Bespoke East African Safaris",
    description: "Curated safaris connecting Mombasa with Tsavo, Amboseli, and the Mara.",
    images: ["https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&h=630&q=85"],
  },
  alternates: {
    canonical: "https://amberplains.co.ke",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Structured Data Schema for Search Engines (Schema.org / TravelAgency)
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "Amber Plains Travel Ltd",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=85",
    description: "Mombasa-based bespoke East African tour operator curating private wildlife safaris and coastal expeditions.",
    url: "https://amberplains.co.ke",
    telephone: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || process.env.NEXT_PUBLIC_COMPANY_PHONE || "+254700123456",
    priceRange: "$$$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Suite 4B, Bamburi Beach Ridge, Off Malindi Highway",
      addressLocality: "Mombasa",
      addressRegion: "Coast",
      postalCode: "80100",
      addressCountry: "KE",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "-4.0435",
      longitude: "39.6682",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "07:00",
        closes: "21:00",
      },
    ],
    sameAs: [
      "https://instagram.com/amberplainstravel",
      "https://facebook.com/amberplainstravel",
    ],
  };

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </head>
      <body className="bg-safari-night text-safari-sand min-h-screen font-sans antialiased selection:bg-gold-400 selection:text-safari-night">
        {children}
      </body>
    </html>
  );
}
