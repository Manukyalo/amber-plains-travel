import { SiteSettings } from "@/types";

export const siteSettingsData: SiteSettings = {
  brandName: "Amber Plains Travel",
  tagline: "Bespoke East African Safaris & Coastal Wilderness",
  foundedYear: 2014,
  headquarters: "Mombasa, Kenya",
  phone: process.env.NEXT_PUBLIC_COMPANY_PHONE || "+254 700 123 456",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || process.env.NEXT_PUBLIC_COMPANY_WHATSAPP || "+254 700 123 456",
  email: process.env.NEXT_PUBLIC_COMPANY_EMAIL || "safaris@amberplains.co.ke",
  emergencyPhone: "+254 711 987 654 (24/7 Operations Duty Officer)",
  address: {
    line1: "Suite 4B, Bamburi Beach Ridge",
    line2: "Off Malindi Highway, North Coast",
    city: "Mombasa",
    country: "Kenya",
  },
  socialLinks: {
    instagram: "https://instagram.com/amberplainstravel",
    facebook: "https://facebook.com/amberplainstravel",
    youtube: "https://youtube.com/@amberplainstravel",
    linkedin: "https://linkedin.com/company/amberplainstravel",
  },
  certifications: [
    "KATO Bonded Member (Kenya Association of Tour Operators)",
    "EcoTourism Kenya Gold Certified Operator",
    "Kenya Tourism Board / Magical Kenya Partner",
    "KPSGA Guide Fellowship (Kenya Professional Safari Guides Association)",
    "AMREF Flying Doctors Medical Evacuation Partner"
  ],
  appUrls: {
    downloadPage: process.env.NEXT_PUBLIC_APP_DOWNLOAD_URL || "https://amberplains.co.ke/app",
    appleStore: process.env.NEXT_PUBLIC_APPLE_STORE_URL || "",
    googlePlay: process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL || "",
    isStoreLive: Boolean(process.env.NEXT_PUBLIC_APPLE_STORE_URL && process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL),
  },
};
