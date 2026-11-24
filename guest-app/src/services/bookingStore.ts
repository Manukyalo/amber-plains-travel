import { SafariBooking, BookingStatus, AirportTransferOption, ChangeRequest } from '../types';
import { SAMPLE_BOOKINGS, AIRPORT_TRANSFERS } from './safariData';
import { supabase } from '../lib/supabase';

let currentBookings: SafariBooking[] = [...SAMPLE_BOOKINGS];
const listeners: Array<(bookings: SafariBooking[]) => void> = [];

function notify() {
  listeners.forEach((listener) => listener([...currentBookings]));
}

export const BookingStore = {
  subscribe(listener: (bookings: SafariBooking[]) => void) {
    listeners.push(listener);
    listener([...currentBookings]);
    return () => {
      const idx = listeners.indexOf(listener);
      if (idx > -1) listeners.splice(idx, 1);
    };
  },

  getAll(): SafariBooking[] {
    return [...currentBookings];
  },

  getById(id: string): SafariBooking | undefined {
    return currentBookings.find((b) => b.id === id);
  },

  async createEnquiry(params: {
    guestName: string;
    guestEmail: string;
    packageTitle: string;
    destinations: string[];
    startDate: string;
    durationDays: number;
    adults: number;
    children: number;
    accommodationTier: 'Luxury Tented Camp' | 'Executive Bush Lodge' | 'Exclusive Bush Villa';
    transferOptionId?: string;
    specialRequests?: string;
  }): Promise<SafariBooking> {
    const selectedTransfer = AIRPORT_TRANSFERS.find((t) => t.id === params.transferOptionId) || AIRPORT_TRANSFERS[0];
    
    // Calculate end date
    const start = new Date(params.startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + params.durationDays);
    const endDateStr = end.toISOString().split('T')[0];

    // Estimated price calculation
    const baseDailyRate = params.accommodationTier === 'Exclusive Bush Villa' ? 750 : params.accommodationTier === 'Executive Bush Lodge' ? 550 : 420;
    const estTotal = (params.adults * baseDailyRate + params.children * (baseDailyRate * 0.6)) * params.durationDays + selectedTransfer.price_usd;

    const newBooking: SafariBooking = {
      id: `bk-${Date.now()}`,
      reference_number: `AP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      guest_id: 'guest-director-1',
      guest_name: params.guestName,
      guest_email: params.guestEmail,
      package_title: params.packageTitle,
      destinations: params.destinations,
      start_date: params.startDate,
      end_date: endDateStr,
      duration_days: params.durationDays,
      adults: params.adults,
      children: params.children,
      accommodation_tier: params.accommodationTier,
      status: 'enquiry',
      total_amount_usd: estTotal,
      paid_amount_usd: 0,
      currency: 'USD',
      pickup_instructions: 'Pickup location and vehicle assignment will be finalized upon booking confirmation.',
      transfer_option: selectedTransfer,
      // Vehicle & Guide assignments start as UNCONFIRMED per business rule:
      // "View assigned safari vehicle, driver/guide profile and trip details only after the company has confirmed the assignment."
      assigned_vehicle: {
        model: 'Custom Safari 4x4 Cruiser (Allocation in progress)',
        plate_number: 'Assignment Pending',
        type: 'Heavy Duty 4x4 Bush Cruiser',
        features: ['Pop-up game-viewing roof', 'Onboard refrigerated cooler', 'VHF radio', 'High-clearance suspension'],
        pop_up_roof: true,
        vhf_radio: true,
        charging_ports: true,
        refrigerated_cooler: true,
        photo_url: '',
        assignment_confirmed: false,
      },
      assigned_guide: {
        name: 'Master Safari Guide (Allocating)',
        kpsga_badge: 'Silver',
        languages: ['English', 'Swahili'],
        experience_years: 0,
        bio: 'Your dedicated guide will be assigned once park permits and concession access are validated.',
        avatar_url: '',
        phone: '',
        assignment_confirmed: false,
      },
      itinerary: [
        {
          day: 1,
          title: `Departure to ${params.destinations[0] || 'Wilderness'}`,
          location: params.destinations[0] || 'Kenyan Savanna',
          morning: `Private transfer via ${selectedTransfer.name} to expedition starting point.`,
          afternoon: 'First introductory afternoon game drive.',
          evening: 'Fireside welcome dinner and safari orientation.',
          meals: 'Lunch, Dinner',
          accommodation: `${params.accommodationTier} Partner Property`,
        },
      ],
      private_photos: [],
      change_requests: [],
      created_at: new Date().toISOString(),
    };

    currentBookings.unshift(newBooking);
    notify();

    // Sync to Supabase bookings table in background if available
    try {
      await supabase.from('bookings').insert([
        {
          reference_number: newBooking.reference_number,
          guest_name: params.guestName,
          guest_email: params.guestEmail,
          package_title: params.packageTitle,
          start_date: newBooking.start_date,
          end_date: newBooking.end_date,
          status: 'enquiry',
          total_amount_usd: estTotal,
          paid_amount_usd: 0,
          adults: params.adults,
          children: params.children,
          transfer_option: selectedTransfer.name,
        },
      ]);
    } catch {
      // Local state maintained
    }

    return newBooking;
  },

  async requestChange(bookingId: string, type: ChangeRequest['type'], reason: string): Promise<void> {
    const booking = currentBookings.find((b) => b.id === bookingId);
    if (!booking) return;

    const request: ChangeRequest = {
      id: `cr-${Date.now()}`,
      requested_at: new Date().toISOString(),
      type,
      reason,
      status: 'pending_review',
      admin_notes: 'Under review by Amber Plains Operations Dispatch. Confirmation does not apply automatically.',
    };

    booking.change_requests.push(request);
    notify();
  },

  async recordPayment(bookingId: string, amount: number, method: 'M-Pesa STK' | 'IntaSend Card' | 'Wire'): Promise<boolean> {
    const booking = currentBookings.find((b) => b.id === bookingId);
    if (!booking) return false;

    booking.paid_amount_usd += amount;
    if (booking.paid_amount_usd >= booking.total_amount_usd) {
      booking.status = 'confirmed';
      // If confirmed, reveal vehicle & guide assignment!
      if (booking.assigned_vehicle) {
        booking.assigned_vehicle.assignment_confirmed = true;
        booking.assigned_vehicle.plate_number = 'KDJ 492M';
        booking.assigned_vehicle.model = 'Toyota Land Cruiser V8 Extended 4x4';
      }
      if (booking.assigned_guide) {
        booking.assigned_guide.assignment_confirmed = true;
        booking.assigned_guide.name = "David Ndung'u";
        booking.assigned_guide.experience_years = 12;
        booking.assigned_guide.phone = '+254 711 502 918';
      }
    }
    notify();
    return true;
  },
};
