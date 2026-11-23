import { z } from "zod";

// ==========================================
// 1. Safari Package Models
// ==========================================

export interface ItineraryDay {
  day: number;
  title: string;
  location: string;
  accommodation: string;
  meals: string; // e.g. "Breakfast, Lunch, Gourmet Dinner"
  description: string;
  highlights: string[];
}

export interface PackagePricing {
  indicativeUsd: number;
  currency: string;
  priceNote: string; // e.g. "Per person sharing, based on 2 guests in luxury camp"
  seasonalRates?: {
    season: "Peak" | "High" | "Green";
    dates: string;
    rateUsd: number;
  }[];
}

export interface PackageFaq {
  question: string;
  answer: string;
}

export interface SafariPackage {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  durationDays: number;
  startLocation: string; // e.g. "Mombasa / Diani Beach"
  endLocation: string;   // e.g. "Mombasa or Nairobi"
  destinations: string[]; // e.g. ["Tsavo East", "Amboseli", "Maasai Mara"]
  experienceTypes: string[]; // e.g. ["Bush-to-Beach", "Big Five Classic", "Fly-in Safari"]
  difficulty: "Gentle" | "Moderate" | "Active";
  bestTimeToVisit: string;
  heroImage: string;
  galleryImages: string[];
  overview: string;
  curatorNote: string;
  highlights: string[];
  itinerary: ItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  accommodationNotes: string;
  pricing: PackagePricing;
  faqs: PackageFaq[];
  isFeatured: boolean;
  metaTitle: string;
  metaDescription: string;
}

// ==========================================
// 2. Destination Models
// ==========================================

export interface Destination {
  id: string;
  slug: string;
  name: string;
  region: string; // e.g. "Southern Kenya", "Coastal Wilderness", "Rift Valley"
  tagline: string;
  description: string;
  heroImage: string;
  galleryImages: string[];
  climate: string;
  bestTimeToVisit: string;
  wildlifeHighlights: string[];
  travelStyle: string;
  distanceFromMombasa: string; // Useful for Mombasa-based operator
  isFeatured: boolean;
  metaTitle: string;
  metaDescription: string;
}

// ==========================================
// 3. Experience & Travel Style Models
// ==========================================

export interface Experience {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  summary: string;
  description: string;
  heroImage: string;
  galleryImages: string[];
  highlights: string[];
  suitableFor: string[];
  includedInPackages: string[]; // package slugs
  metaTitle: string;
  metaDescription: string;
}

// ==========================================
// 4. Gallery Models
// ==========================================

export type GalleryCategory =
  | "all"
  | "wildlife"
  | "landscapes"
  | "camps"
  | "coastal"
  | "culture";

export interface GalleryItem {
  id: string;
  title: string;
  category: "wildlife" | "landscapes" | "camps" | "coastal" | "culture";
  imageUrl: string;
  aspectRatio: "landscape" | "portrait" | "square" | "panoramic";
  location: string;
  caption: string;
  photographerCredit: string;
  cameraSettings?: string; // e.g. "Sony A1 · 400mm f/2.8 · 1/1600s"
  isHeroCandidate?: boolean;
}

// ==========================================
// 5. Testimonial Models
// ==========================================

export interface Testimonial {
  id: string;
  guestName: string;
  country: string;
  travelDate: string;
  tripTitle: string;
  quote: string;
  rating: number; // 5
  avatarUrl?: string;
  isVerified: boolean;
}

// ==========================================
// 6. Travel Journal / Editorial Articles
// ==========================================

export interface JournalArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string[]; // Structured paragraphs
  category: "Wildlife Dispatches" | "Safari Guides" | "Coastal Notes" | "Conservation";
  coverImage: string;
  readTime: string;
  publishedAt: string;
  author: {
    name: string;
    role: string;
    avatarUrl: string;
  };
  metaTitle: string;
  metaDescription: string;
}

// ==========================================
// 7. Site Settings & Brand Configuration
// ==========================================

export interface SiteSettings {
  brandName: string;
  tagline: string;
  foundedYear: number;
  headquarters: string;
  phone: string;
  whatsapp: string;
  email: string;
  emergencyPhone: string;
  address: {
    line1: string;
    line2: string;
    city: string;
    country: string;
  };
  socialLinks: {
    instagram: string;
    facebook: string;
    youtube: string;
    linkedin: string;
  };
  certifications: string[];
  appUrls: {
    downloadPage: string;
    appleStore: string;
    googlePlay: string;
    isStoreLive: boolean;
  };
}

// ==========================================
// 8. Enquiries (Zod Schemas & Types)
// ==========================================

export const enquirySchema = z.object({
  fullName: z.string().min(2, "Please enter your full name").max(100),
  email: z.string().email("Please provide a valid email address"),
  phone: z.string().min(6, "Please provide your phone or WhatsApp number with country code"),
  preferredDates: z.string().min(3, "Please let us know your planned travel month or dates"),
  dateFlexibility: z.enum(["exact", "flexible_week", "flexible_month", "exploring"]),
  adultsCount: z.number().int().min(1, "At least 1 adult is required").max(30),
  childrenCount: z.number().int().min(0).max(20).default(0),
  childrenAges: z.string().optional(),
  packageOrDestination: z.string().min(2, "Please select or type your destination or package of interest"),
  travelStyle: z.enum([
    "bush_to_beach",
    "luxury_fly_in",
    "classic_big_five",
    "private_photographic",
    "bespoke_family",
    "honeymoon"
  ]),
  budgetRangePerPersonUsd: z.enum([
    "under_3000",
    "3000_to_6000",
    "6000_to_10000",
    "10000_plus",
    "bespoke"
  ]),
  specialRequests: z.string().max(2000).optional(),
  // Anti-spam honeypot (must remain empty for real humans)
  honeypot: z.string().max(0, "Spam detected").optional().default(""),
});

export type EnquiryFormData = z.infer<typeof enquirySchema>;

export interface EnquirySubmissionResult {
  success: boolean;
  referenceNumber?: string;
  message: string;
  errors?: Record<string, string[]>;
}

// ==========================================
// 9. App Notify Me Schema & Types
// ==========================================

export const appNotifySchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  devicePlatform: z.enum(["ios", "android", "both"]).default("both"),
  consentMarketing: z.boolean().refine(val => val === true, {
    message: "Consent is required to receive notification",
  }),
  honeypot: z.string().max(0).optional().default(""),
});

export type AppNotifyFormData = z.infer<typeof appNotifySchema>;
