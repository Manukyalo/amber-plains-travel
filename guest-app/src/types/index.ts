export type BookingStatus =
  | 'enquiry'
  | 'quoted'
  | 'confirmed'
  | 'in_safari'
  | 'completed'
  | 'cancelled';

export interface GuestProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  nationality?: string;
  passport_number?: string;
  emergency_contact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  dietary_requirements?: string;
  created_at?: string;
}

export interface DayItinerary {
  day: number;
  title: string;
  location: string;
  morning: string;
  afternoon: string;
  evening: string;
  meals: string;
  accommodation: string;
}

export interface VehicleAssignment {
  model: string;
  plate_number: string;
  type: string;
  features: string[];
  pop_up_roof: boolean;
  vhf_radio: boolean;
  charging_ports: boolean;
  refrigerated_cooler: boolean;
  photo_url: string;
  assignment_confirmed: boolean;
}

export interface GuideAssignment {
  name: string;
  kpsga_badge: 'Silver' | 'Gold' | 'Bronze';
  languages: string[];
  experience_years: number;
  bio: string;
  avatar_url: string;
  phone: string;
  assignment_confirmed: boolean;
}

export interface AirportTransferOption {
  id: string;
  name: string;
  vehicle_type: string;
  description: string;
  luggage_capacity: string;
  passenger_capacity: string;
  price_usd: number;
}

export interface PrivateTripPhoto {
  id: string;
  caption: string;
  location: string;
  captured_at: string;
  image_url: string;
  photographer: string;
}

export interface ChangeRequest {
  id: string;
  requested_at: string;
  type: 'date_change' | 'pax_change' | 'cancellation' | 'special_request';
  reason: string;
  status: 'pending_review' | 'approved' | 'declined';
  admin_notes?: string;
}

export interface SafariBooking {
  id: string;
  reference_number: string;
  guest_id: string;
  guest_name: string;
  guest_email: string;
  package_title: string;
  destinations: string[];
  start_date: string;
  end_date: string;
  duration_days: number;
  adults: number;
  children: number;
  accommodation_tier: 'Luxury Tented Camp' | 'Executive Bush Lodge' | 'Exclusive Bush Villa';
  status: BookingStatus;
  total_amount_usd: number;
  paid_amount_usd: number;
  currency: string;
  pickup_instructions: string;
  transfer_option?: AirportTransferOption;
  assigned_vehicle?: VehicleAssignment;
  assigned_guide?: GuideAssignment;
  itinerary: DayItinerary[];
  private_photos: PrivateTripPhoto[];
  change_requests: ChangeRequest[];
  created_at: string;
}

export interface SafariPackage {
  id: string;
  slug: string;
  title: string;
  duration_days: number;
  subtitle: string;
  summary: string;
  hero_image: string;
  price_from_usd: number;
  destinations: string[];
  highlights: string[];
  best_season: string;
  wildlife: string[];
}

export interface MerchandiseItem {
  id: string;
  name: string;
  category: 'Apparel' | 'Field Gear' | 'Luggage' | 'Collectibles';
  price_usd: number;
  description: string;
  image_url: string;
  sizes?: string[];
  in_stock: boolean;
}

export interface CartItem {
  product: MerchandiseItem;
  quantity: number;
  selected_size?: string;
}
