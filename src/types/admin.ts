import { z } from "zod";

// ============================================================================
// 1. ROLES & AUTHENTICATION
// ============================================================================

export type UserRole =
  | "super_admin"
  | "safari_director"
  | "operations_manager"
  | "finance_controller"
  | "head_guide";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  permissions: string[];
}

// ============================================================================
// 2. BOOKINGS & CRM
// ============================================================================

export type BookingStage =
  | "new_inquiry"
  | "scoping"
  | "quote_drafted"
  | "quote_sent"
  | "deposit_pending"
  | "confirmed"
  | "in_safari"
  | "completed"
  | "cancelled";

export interface GuestProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  passportNumber?: string;
  dietaryRequirements?: string;
  medicalNotes?: string;
  totalTripsWithUs: number;
  vipStatus: boolean;
}

export interface BookingNote {
  id: string;
  authorName: string;
  createdAt: string;
  text: string;
  isInternalOnly: boolean;
}

export interface SafariBooking {
  id: string;
  referenceCode: string; // e.g. "APT-2026-7842"
  guest: GuestProfile;
  packageSlug?: string;
  customTitle: string;
  stage: BookingStage;
  startDate: string;
  endDate: string;
  durationDays: number;
  adultsCount: number;
  childrenCount: number;
  assignedGuideId?: string;
  assignedVehicleId?: string;
  totalSellingPriceUsd: number;
  depositAmountUsd: number;
  depositPaid: boolean;
  balanceDueUsd: number;
  balanceDueDate: string;
  notes: BookingNote[];
  createdVia: "website_enquiry" | "ai_receptionist" | "direct_walk_in" | "agent_partner";
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// 3. SUPPLIER CONTRACTS & RATES
// ============================================================================

export type SupplierCategory =
  | "luxury_lodge"
  | "tented_camp"
  | "domestic_aviation"
  | "marine_dhow"
  | "park_authority"
  | "balloon_operator"
  | "cultural_trust";

export interface LodgeRoomRate {
  id: string;
  roomCategory: string; // "Deluxe Safari Tent", "Family Cottage", "Honeymoon Suite"
  season: "Peak" | "High" | "Green";
  mealPlan: "Full Board" | "Game Package" | "Bed & Breakfast" | "All Inclusive";
  rateBasis: "per_person_sharing" | "single_supplement" | "per_unit" | "per_person_total";
  rateCurrency: "USD" | "KES";
  contractRate: number; // In base currency
  taxIncluded: boolean;
  validFrom: string;
  validTo: string;
}

export interface SupplierContract {
  id: string;
  supplierName: string;
  category: SupplierCategory;
  location: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  contractVersion: string;
  validityStart: string;
  validityEnd: string;
  roomRates: LodgeRoomRate[];
  blackoutDates: string[]; // ISO Date strings
  cancellationPolicy: string;
  documentAttachmentName?: string;
  documentVerified: boolean;
  status: "active" | "under_review" | "expired";
}

// ============================================================================
// 4. COSTING & PRICING ENGINE
// ============================================================================

export type CostItemCategory =
  | "accommodation"
  | "park_conservancy_fee"
  | "vehicle_fuel"
  | "guide_allowance"
  | "bush_flight"
  | "activity"
  | "contingency_buffer";

export interface CostingLineItem {
  id: string;
  supplierContractId?: string;
  contractVersion?: string;
  category: CostItemCategory;
  description: string;
  rateBasis: "per_person_total" | "per_person_per_night" | "per_vehicle_per_day" | "fixed_group";
  unitCost: number;
  quantity: number;
  multiplier: number; // e.g. nights or guests
  currency: "USD" | "KES";
  exchangeRateToUsd: number;
  totalCostUsd: number;
  isConfidentialSupplierRate: boolean;
}

export interface CostingCalculationSummary {
  totalDirectCostUsd: number;
  contingencyBufferRate: number; // e.g. 0.05 (5%)
  contingencyBufferUsd: number;
  effectiveTotalCostUsd: number;
  
  // Pricing formulas
  // sellingPrice = effectiveTotalCostUsd * (1 + markupRate)
  // grossMargin = (sellingPrice - effectiveTotalCostUsd) / sellingPrice
  markupRate: number; // e.g. 0.28 (28% markup)
  sellingPriceUsd: number;
  grossProfitUsd: number;
  grossMarginPercentage: number; // e.g. 21.87%
  
  minimumProfitThresholdMargin: number; // e.g. 18%
  isProfitabilityApproved: boolean;
  belowThresholdWarning: boolean;
  warningNotes?: string[];
}

export interface QuoteVersion {
  id: string;
  quoteNumber: string; // "Q-2026-104-V2"
  bookingId: string;
  versionNumber: number;
  status: "draft" | "approved" | "sent_to_guest" | "accepted" | "superseded";
  createdBy: string;
  createdAt: string;
  calculation: CostingCalculationSummary;
  lineItems: CostingLineItem[];
  guestFriendlyItinerarySummary: string;
  termsConditionsSnippet: string;
}

// ============================================================================
// 5. FLEET & OPERATIONS
// ============================================================================

export interface SafariVehicle {
  id: string;
  registrationPlate: string; // e.g. "KDE 412X"
  makeModel: string; // "Toyota Land Cruiser 4x4 Extended"
  passengerCapacity: number; // 6 or 7 window seats
  hasInverter220v: boolean;
  hasFridge: boolean;
  hasPopUpRoof: boolean;
  status: "available" | "on_safari" | "scheduled_maintenance" | "in_service";
  currentKilometers: number;
  lastServiceDate: string;
  nextServiceKilometers: number;
  assignedDriverId?: string;
  currentTripRef?: string;
}

// ============================================================================
// 6. DRIVERS & GUIDES
// ============================================================================

export interface SafariGuide {
  id: string;
  fullName: string;
  kpsgaLevel: "Bronze" | "Silver" | "Gold";
  licenseNumber: string;
  phone: string;
  languages: string[];
  status: "available" | "on_safari" | "on_leave" | "standby";
  assignedVehicleId?: string;
  currentBookingRef?: string;
  driverAppLinked: boolean;
  lastKnownLocation?: string;
}

// ============================================================================
// 7. PAYMENTS & FINANCE
// ============================================================================

export type PaymentStatus =
  | "pending"
  | "processing"
  | "succeeded"
  | "failed"
  | "refunded";

export type PaymentProvider = "mpesa" | "intasend" | "stripe" | "bank_wire" | "cash";

export interface TransactionRecord {
  id: string;
  bookingReference: string;
  idempotencyKey: string;
  provider: PaymentProvider;
  providerTransactionId: string;
  amountCents: number; // Stored in lowest currency unit (cents / cents)
  currency: "USD" | "KES" | "EUR" | "GBP";
  status: PaymentStatus;
  type: "deposit" | "final_balance" | "extra_activity" | "refund";
  verifiedAt?: string;
  rawWebhookPayloadId?: string;
  notes?: string;
  createdAt: string;
}

// ============================================================================
// 8. MERCHANDISE
// ============================================================================

export interface MerchandiseItem {
  id: string;
  sku: string;
  title: string;
  category: "apparel" | "headwear" | "field_gear" | "curios";
  priceUsd: number;
  costUsd: number;
  stockQuantity: number;
  reorderThreshold: number;
  imageUrl: string;
  status: "in_stock" | "low_stock" | "out_of_stock";
}

// ============================================================================
// 9. AI RECEPTIONIST (TELEPHONY & MISSED-CALL LEAD CAPTURE)
// ============================================================================

export type CallDirection = "inbound" | "outbound";
export type CallStatus = "completed" | "missed" | "in_progress" | "escalated_to_human";

export interface TelephonyCallEvent {
  id: string;
  callSid: string;
  provider: "twilio" | "africas_talking" | "sip_trunk";
  callerNumber: string;
  callerCountry?: string;
  timestamp: string;
  durationSeconds: number;
  direction: CallDirection;
  status: CallStatus;
  recordingConsentGiven: boolean;
  transcriptSnippet?: string;
  extractedIntent?: {
    callerName?: string;
    travelDates?: string;
    guestCount?: number;
    destinationOfInterest?: string;
    targetBudgetUsd?: number;
    urgency: "low" | "medium" | "urgent_same_day";
  };
  escalationReason?: "human_requested" | "complex_budget" | "complaint" | "uncertain_availability";
  assignedAgent?: string;
  associatedLeadId?: string;
}

// ============================================================================
// 10. WEBSITE HUNTER (COMPETITOR OBSERVATION & PUBLIC SEO GAPS)
// ============================================================================

export interface CompetitorProfile {
  id: string;
  companyName: string;
  publicWebsiteUrl: string;
  marketTier: "budget_group" | "mid_range" | "ultra_luxury_direct";
  focusRegions: string[];
  lastObservedAt: string;
  robotsTxtStatus: "allowed" | "partially_restricted";
  observablePackagesCount: number;
  observedPriceRangeUsd: {
    min: number;
    max: number;
  };
  observedFeatures: string[]; // e.g. "Instant WhatsApp button", "Live chat", "Self-booking engine"
  detectedSeoGaps: string[];
  aiRecommendations: {
    title: string;
    opportunity: string;
    suggestedAction: string;
    effort: "low" | "medium" | "high";
    impact: "low" | "medium" | "high";
    confidenceScore: number; // 0 to 1
    approvedByAdmin: boolean;
  }[];
}

// ============================================================================
// 11. SEO ENGINE & AUDIT
// ============================================================================

export interface SeoAuditPage {
  path: string;
  metaTitle: string;
  metaDescription: string;
  titleLength: number;
  descriptionLength: number;
  canonicalUrl: string;
  hasSchemaOrg: boolean;
  schemaType?: string;
  keywordRankings: {
    keyword: string;
    estimatedPosition: number;
    monthlyImpressions: number;
  }[];
  contentImprovementSuggestion?: string;
  status: "healthy" | "needs_attention" | "critical_gap";
}

// ============================================================================
// 12. APP DISTRIBUTION & QR SETTINGS
// ============================================================================

export interface AppDistributionSettings {
  stableDownloadUrl: string; // First-party URL
  isAppleStoreLive: boolean;
  appleStoreUrl: string;
  isGooglePlayLive: boolean;
  googlePlayUrl: string;
  qrCodeArtwork: {
    svgDownloadPath: string;
    pngDownloadPath: string;
    lastGeneratedAt: string;
  };
  totalQrScansEstimated: number;
  vipWaitlistSubscribersCount: number;
}
