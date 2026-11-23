# Amber Plains Travel — Phase 1: Public Digital Platform

A high-performance digital platform for **Amber Plains Travel Ltd**, a premier Mombasa-based tour operator specializing in bespoke East African safaris that connect the Swahili coast with the interior wilderness of Tsavo, Amboseli, and the Maasai Mara.

Built with an editorial aesthetic inspired by fine safari journals: cinematic full-bleed wildlife photography, minimal transparent navigation, elegant serif typography, restrained gold actions, and an unhurried luxury travel atmosphere.

---

## 1. Architecture & Tech Stack

```
amber-plains-travel/
├── src/
│   ├── app/                    # Next.js 15 App Router (SSR, SSG, Metadata & Dynamic APIs)
│   │   ├── api/                # API Route handlers (Zod validation, rate limiting, anti-spam)
│   │   │   ├── enquiry/        # Safari tailor-made booking enquiry endpoint
│   │   │   └── app-notify/     # VIP guest app launch waitlist notification endpoint
│   │   ├── safaris/            # Safari listing & [slug] dynamic package detail pages
│   │   ├── destinations/       # Destination index & [slug] regional pages
│   │   ├── experiences/        # Travel styles & [slug] experiential pages
│   │   ├── gallery/            # Curated visual dispatches with keyboard-operable lightbox
│   │   ├── journal/            # Travel journal & [slug] editorial essays
│   │   ├── about/              # Mombasa heritage, guiding fellowship & fleet standards
│   │   ├── contact/            # Interactive tailor-made expedition planner
│   │   ├── app/                # Dedicated guest app landing with branded QR generator
│   │   ├── privacy/            # Kenya DPA (2019) & GDPR privacy notice
│   │   ├── terms/              # KATO standard booking terms & cancellation schedule
│   │   ├── trust-and-safety/   # AMREF Flying Doctors, vehicle specs & wildlife ethics
│   │   ├── sitemap.ts          # Automated dynamic XML sitemap
│   │   └── robots.ts           # Search engine crawler policies
│   ├── components/             # Reusable UI & Layout Components
│   │   ├── layout/             # Navbar (transparent/frosted), Footer
│   │   ├── ui/                 # SectionHeading, Button, Lightbox, Badges
│   │   ├── home/               # HeroSection, FeaturedPackages, DestinationsDiscovery, etc.
│   │   ├── safaris/            # PackageCard, PackageFilterBar, PackageItineraryAccordion
│   │   ├── enquiry/            # EnquiryForm with Zod schema validation & honeypot
│   │   ├── gallery/            # GalleryClient with category filtering
│   │   └── app/                # QrCodeCard (SVG/PNG generator) & AppNotifyForm
│   ├── services/               # Data-access service boundary (Phase 2 CMS ready)
│   │   ├── packageService.ts
│   │   ├── destinationService.ts
│   │   ├── experienceService.ts
│   │   ├── galleryService.ts
│   │   ├── journalService.ts
│   │   ├── testimonialService.ts
│   │   ├── siteSettingsService.ts
│   │   └── qrService.ts        # QR generation encoding stable first-party company URL
│   ├── data/                   # Typed mock data layer with strict contracts
│   └── types/                  # Centralized TypeScript definitions & Zod schemas
├── public/                     # Public static assets
└── .env.example                # Documented configuration variables
```

### Core Technologies
- **Framework:** Next.js 15 (App Router, Static Site Generation for all packages/destinations)
- **Language:** TypeScript 5 (Strict mode enabled, zero `any` assertions)
- **Styling:** Tailwind CSS 3 with custom editorial safari palette (Gold `#C5A059`, Safari Night `#0B0E0C`, Safari Cream `#FAF7F2`)
- **Typography:** Editorial Serif (`Cormorant Garamond`) paired with modern geometric Sans (`Plus Jakarta Sans`)
- **Icons:** Lucide React
- **Validation & Anti-Spam:** Zod runtime validation, silent honeypot trap, in-memory IP sliding-window rate limiting
- **QR Code Engine:** `qrcode` library supporting both PNG raster and scalable vector SVG export

---

## 2. Routes Directory & Features

| Route | Purpose | Key Capabilities |
| :--- | :--- | :--- |
| `/` | **Home** | Cinematic hero, featured packages, destination discovery, travel styles, curated gallery preview, brand story, verified testimonials, guest app promotion, enquiry CTA. |
| `/safaris` | **Packages Listing** | Multi-faceted client filter (Destination, Duration [Short/Classic/Odyssey], Travel Style, Search Keyword) with live count and reset. |
| `/safaris/[slug]` | **Package Detail** | Day-by-day accordion itinerary, lodge notes, meal plans, inclusions, exclusions, seasonal rates table, FAQs, JSON-LD `TouristTrip` schema, direct enquiry form. |
| `/destinations` | **Destinations Index** | Editorial overview of Tsavo East/West, Amboseli, Maasai Mara, and the Swahili Coast. |
| `/destinations/[slug]` | **Destination Detail** | Climate, prime seasons, transit time from Mombasa, wildlife highlights, and linked safari packages. |
| `/experiences` | **Travel Styles** | Bush-to-Beach combinations, Private 4x4 Cruisers, Dawn Hot Air Balloon Safaris, Guided Conservation Walks. |
| `/experiences/[slug]` | **Experience Detail** | In-depth philosophy, suitability breakdown, and linked safari itineraries. |
| `/gallery` | **Visual Dispatches** | Category filters (`wildlife`, `landscapes`, `coastal`, `camps`, `culture`), photographer credits, camera settings, accessible keyboard lightbox (Esc, Left/Right arrows). |
| `/journal` | **Travel Journal** | Curated essays on wildlife movements, the Great Migration, and coastal culture. |
| `/journal/[slug]` | **Journal Article** | High-readability editorial layout, reading times, author profiles. |
| `/about` | **About Us** | Mombasa heritage (est. 2014), KPSGA certified guiding fellowship, 4x4 fleet specifications, community conservancy stewardship. |
| `/contact` | **Contact & Planner** | Comprehensive tailor-made enquiry form, Mombasa HQ address, Diani Beach lounge, WhatsApp direct line, operating hours. |
| `/app` | **Guest Companion App** | Branded QR code encoding stable first-party company link, downloadable as high-res PNG & SVG vector for lodge print collateral, device detection, "Coming Soon" notification form. |
| `/privacy` | **Privacy Policy** | Kenya Data Protection Act (2019) & GDPR compliance, strict confidential handling of guest data. |
| `/terms` | **Booking Conditions** | KATO bonded deposit schedule (30% deposit, 70% at 60 days), cancellation terms, force majeure. |
| `/trust-and-safety` | **Wilderness Safety** | AMREF Flying Doctors 24/7 evacuation, 42-point fleet inspection, armed ranger walk protocols, ethical viewing code. |
| `/sitemap.xml` | **XML Sitemap** | Dynamic sitemap generated at build time covering all static and dynamic paths. |
| `/robots.txt` | **Robots.txt** | Crawler guidance with canonical sitemap URL. |

---

## 3. Guest App Discovery & QR Architecture

1. **Stable First-Party URL:** The QR code strictly encodes `https://amberplains.co.ke/app` (configured via `NEXT_PUBLIC_APP_DOWNLOAD_URL`), **never** a temporary Expo URL, hardcoded store URL, or private guest token.
2. **Downloadable Formats:**
   - **Vector SVG:** Scalable vector asset for high-resolution print collateral (lodge welcome folios, vehicle seat tags, safari luggage tags).
   - **Raster PNG:** Sized for digital use and email attachments.
3. **Phase 1/2 "Coming Soon" State:**
   - Detects whether the visitor is on iOS, Android, or Desktop.
   - Shows transparent status indicating the Expo native guest app is in preparation for Phase 3.
   - Consent-based VIP notify-me form (`/api/app-notify`) capturing email and preferred platform.
4. **Phase 3 Activation:** When the app is approved and published on the Apple App Store and Google Play, simply populate `NEXT_PUBLIC_APPLE_STORE_URL` and `NEXT_PUBLIC_GOOGLE_PLAY_URL` in `.env.local`. The `/app` page will automatically surface the live store download badges.

---

## 4. Setup & Production Build Instructions

### Prerequisites
- Node.js `v18.18+` or `v20+` (tested on Node `v24.14.0`)
- npm `v10+` or `v11+`

### 1. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Configure your domain coordinates in `.env.local`:
```ini
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_APP_DOWNLOAD_URL=http://localhost:3000/app
NEXT_PUBLIC_COMPANY_NAME="Amber Plains Travel Ltd"
NEXT_PUBLIC_COMPANY_PHONE="+254 700 123 456"
NEXT_PUBLIC_COMPANY_WHATSAPP="+254 700 123 456"
NEXT_PUBLIC_COMPANY_EMAIL="safaris@amberplains.co.ke"
```

### 2. Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 3. Type Checking
```bash
npm run typecheck
```

### 4. Production Build
```bash
npm run build
npm run start
```
The production build compiles **35 static and dynamic pages** with zero errors.

---

## 5. Security & Anti-Spam Architecture

- **Zod Runtime Validation:** Both `/api/enquiry` and `/api/app-notify` enforce strict input types, bounds, and string constraints before processing.
- **Honeypot Trap:** Forms contain an invisible honeypot field (`honeypot`). Submissions containing automated bot filler are silently throttled with zero exposure.
- **Sliding-Window Rate Limiting:** In-memory request tracking throttles rapid spam submissions per client IP, returning HTTP `429 Too Many Requests`.
- **Zero Exposed Inquiries:** Submitted guest inquiries are processed server-side; guest PII is never returned in client API payloads.
- **Zero Committed Secrets:** All credentials, notification targets, and store links live in environment variables.

---

## 6. Recommended Next Steps (Phases 2 & 3)

1. **Phase 2 — Admin Dashboard & Headless CMS:**
   - Replace the mock data layer in `src/data/` with database queries (Supabase / PostgreSQL) using the existing service functions in `src/services/`.
   - Build administrative CRUD workflows for safari packages, seasonal pricing, gallery image uploads, and inquiry triage.
2. **Phase 3 — Expo Guest Companion App:**
   - Scaffold the React Native / Expo guest mobile app utilizing the existing TypeScript contracts from `src/types/index.ts`.
   - Implement offline caching (TanStack Query + SQLite / AsyncStorage) for itineraries and maps.
   - Update `NEXT_PUBLIC_APPLE_STORE_URL` and `NEXT_PUBLIC_GOOGLE_PLAY_URL` in production to transition the `/app` route from "Coming Soon" to active store redirects.
