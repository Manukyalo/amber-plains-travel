import { SafariPackage, AirportTransferOption, MerchandiseItem, SafariBooking } from '../types';

export const SAFARI_PACKAGES: SafariPackage[] = [
  {
    id: 'pkg-1',
    slug: 'coastal-great-savanna',
    title: 'Coastal & Great Savanna Expedition',
    duration_days: 8,
    subtitle: 'From Mombasa coral coast to Tsavo red soil & Amboseli Kilimanjaro vistas',
    summary:
      'The quintessential East African journey connecting the ancient Swahili coastline of Mombasa with the untamed theaters of Tsavo East, Tsavo West, and the elephant sanctuaries of Amboseli.',
    hero_image:
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
    price_from_usd: 3450,
    destinations: ['Mombasa Coast', 'Tsavo East', 'Tsavo West', 'Amboseli'],
    highlights: [
      'Private 4x4 custom cruiser with master safari guide',
      'Sundowners beneath Mount Kilimanjaro',
      'Mudanda Rock elephant watering hole',
      'Mzima Springs hippo & crocodile underwater hide',
    ],
    best_season: 'July – October & December – March',
    wildlife: ['African Elephant', 'Man-eaters of Tsavo Lions', 'Cheetah', 'Hippo', 'Giraffe'],
  },
  {
    id: 'pkg-2',
    slug: 'red-elephants-tsavo',
    title: 'Red Elephants & Galana River',
    duration_days: 4,
    subtitle: 'Deep exploration of Kenya’s largest wilderness frontier',
    summary:
      'Traverse the historic Yatta Plateau and the churning waters of Lugard Falls. Tsavo East offers dramatic iron-red dust landscapes and legendary elephant herds.',
    hero_image:
      'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80',
    price_from_usd: 1850,
    destinations: ['Tsavo East National Park', 'Galana River'],
    highlights: [
      'Track the legendary red elephants of Tsavo',
      'Exclusive night game drive in private conservancy',
      'Bush dinner on the banks of Galana River',
    ],
    best_season: 'Year-round',
    wildlife: ['Red Dust Elephants', 'Lions', 'Oryx', 'Gerenuk', 'Somali Ostrich'],
  },
  {
    id: 'pkg-3',
    slug: 'mara-migration-wing',
    title: 'Maasai Mara Migration Wing Safari',
    duration_days: 6,
    subtitle: 'The greatest wildlife spectacle on Earth from luxury tented camps',
    summary:
      'Fly directly from the Kenyan coast into the heart of the Mara North Conservancy. Witness the thunderous Great Migration river crossings with uncrowded private conservancy access.',
    hero_image:
      'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1200&q=80',
    price_from_usd: 4950,
    destinations: ['Maasai Mara National Reserve', 'Mara North Conservancy'],
    highlights: [
      'Scenic scenic air transfer direct from Mombasa/Diani',
      'Dawn hot air balloon flight with champagne bush breakfast',
      'Mara River crossing viewing points',
      'Maasai warrior bush tracking walk',
    ],
    best_season: 'July – November (Migration peak)',
    wildlife: ['Big Five (Lion, Leopard, Elephant, Buffalo, Rhino)', 'Wildebeest', 'Zebra', 'Cheetah'],
  },
  {
    id: 'pkg-4',
    slug: 'amboseli-crest-kilimanjaro',
    title: 'Amboseli Crest & Kilimanjaro Vistas',
    duration_days: 5,
    subtitle: 'Amboseli basin elephant herds framing Africa’s highest snow peak',
    summary:
      'Wake to the snows of Mount Kilimanjaro towering above emerald acacia swamps. Amboseli is world-renowned for having the most documented elephant population on Earth.',
    hero_image:
      'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=1200&q=80',
    price_from_usd: 2350,
    destinations: ['Amboseli National Park', 'Chyulu Hills'],
    highlights: [
      'Observation Hill 360-degree panoramic wetlands vista',
      'Chyulu Hills cloud forest excursion',
      'Big Tusker elephant encounters with Cynthia Moss research team insights',
    ],
    best_season: 'January – March & June – October',
    wildlife: ['Tusker Elephants', 'Cheetah', 'Serval Cat', 'Crowned Crane', 'Buffalo'],
  },
];

export const AIRPORT_TRANSFERS: AirportTransferOption[] = [
  {
    id: 'trf-1',
    name: 'Executive Toyota Land Cruiser 4WD',
    vehicle_type: 'Custom 4x4 Extended Safari Cruiser',
    description:
      'Heavy-duty all-terrain comfort direct from Moi International Airport (MBA) or Mombasa SGR station to your coastal resort or safari staging lodge.',
    passenger_capacity: 'Up to 6 guests',
    luggage_capacity: '6 large safari soft duffels + carry-ons',
    price_usd: 140,
  },
  {
    id: 'trf-2',
    name: 'Luxury Toyota Alphard VIP Lounge',
    vehicle_type: 'Executive VIP Minivan with Captain Recliners',
    description:
      'Plush leather captain chairs, dual climate zones, USB fast chargers, and quiet smooth transit across Mombasa island and coastal highway corridors.',
    passenger_capacity: 'Up to 5 guests',
    luggage_capacity: '4 medium suitcases + soft bags',
    price_usd: 110,
  },
  {
    id: 'trf-3',
    name: 'Mercedes-Benz E-Class Chauffeur',
    vehicle_type: 'Executive Luxury Sedan',
    description:
      'Discreet, air-conditioned saloon transfer ideal for solo travelers, couples, or corporate directors needing rapid private VIP transit.',
    passenger_capacity: 'Up to 3 guests',
    luggage_capacity: '2 standard suitcases + 2 carry-ons',
    price_usd: 125,
  },
];

export const MERCHANDISE_ITEMS: MerchandiseItem[] = [
  {
    id: 'merch-1',
    name: 'Amber Plains Heritage Safari Fedora',
    category: 'Apparel',
    price_usd: 75,
    description:
      'Handcrafted heavy-cotton twill with genuine Kenyan leather band and brass eyelets for maximum ventilation under equatorial sun.',
    image_url:
      'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=600&q=80',
    sizes: ['S (56cm)', 'M (58cm)', 'L (60cm)', 'XL (62cm)'],
    in_stock: true,
  },
  {
    id: 'merch-2',
    name: 'Bushveld Heavyweight Canvas Field Vest',
    category: 'Apparel',
    price_usd: 130,
    description:
      'Tough storm-washed safari canvas featuring 8 utility storage compartments, lens pouches, and reinforced shoulders for camera straps.',
    image_url:
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=600&q=80',
    sizes: ['M', 'L', 'XL', '2XL'],
    in_stock: true,
  },
  {
    id: 'merch-3',
    name: 'Amber Plains Mara Expedition Duffel (65L)',
    category: 'Luggage',
    price_usd: 195,
    description:
      'Meets all bush-plane soft-sided luggage regulations for safari charter flights. Water-repellent waxed canvas with solid brass hardware.',
    image_url:
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
    in_stock: true,
  },
  {
    id: 'merch-4',
    name: 'Bush Field Binoculars 10x42 ED Glass',
    category: 'Field Gear',
    price_usd: 380,
    description:
      'Nitrogen-purged, fog-proof and waterproof binoculars with premium phase-coated BaK-4 prisms for crystal clear wildlife spotting at dusk and dawn.',
    image_url:
      'https://images.unsplash.com/photo-1511216335778-7cb8f49fa7a3?auto=format&fit=crop&w=600&q=80',
    in_stock: true,
  },
  {
    id: 'merch-5',
    name: 'East African Pique Safari Polo',
    category: 'Apparel',
    price_usd: 60,
    description:
      'Breathable organic cotton pique with embroidered Amber Plains crest. Anti-microbial and moisture-wicking weave.',
    image_url:
      'https://images.unsplash.com/photo-1625910513413-7e447b952f4c?auto=format&fit=crop&w=600&q=80',
    sizes: ['S', 'M', 'L', 'XL'],
    in_stock: true,
  },
];

export const SAMPLE_BOOKINGS: SafariBooking[] = [
  {
    id: 'bk-confirmed-901',
    reference_number: 'AP-2026-9014',
    guest_id: 'guest-director-1',
    guest_name: 'Dr. Jane Somerville',
    guest_email: 'jane.somerville@oxford.ac.uk',
    package_title: 'Coastal & Great Savanna Expedition',
    destinations: ['Mombasa Coast', 'Tsavo East', 'Tsavo West', 'Amboseli'],
    start_date: '2026-12-05',
    end_date: '2026-12-12',
    duration_days: 8,
    adults: 2,
    children: 0,
    accommodation_tier: 'Luxury Tented Camp',
    status: 'confirmed',
    total_amount_usd: 6900,
    paid_amount_usd: 3450,
    currency: 'USD',
    pickup_instructions:
      'Amber Plains private VIP chauffeur will receive you at Moi International Airport (MBA) Arrival Hall 1 holding a personalized wooden Amber Plains placard. Flight KQ604.',
    transfer_option: AIRPORT_TRANSFERS[0],
    assigned_vehicle: {
      model: 'Toyota Land Cruiser V8 Extended 4x4',
      plate_number: 'KDH 814Z',
      type: 'Heavy Duty 4x4 Bush Cruiser',
      features: [
        'Full length 360-degree hydraulic pop-up roof',
        'Built-in 40L 12V Engel refrigerator with chilled beverages',
        'Individual high-speed USB-A & USB-C charging points',
        'Onboard VHF long-range wildlife communications radio',
        'Bean bags for telephoto camera stability',
      ],
      pop_up_roof: true,
      vhf_radio: true,
      charging_ports: true,
      refrigerated_cooler: true,
      photo_url:
        'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
      assignment_confirmed: true,
    },
    assigned_guide: {
      name: 'Jackson Ole Lenku',
      kpsga_badge: 'Silver',
      languages: ['English', 'Swahili', 'Maa', 'Conversational German'],
      experience_years: 14,
      bio:
        'Born and raised along the Amboseli ecosystem, Jackson has over 14 years of professional bush guidance. Certified by the Kenya Professional Safari Guides Association with specialized expertise in big cat predation tracking and ornithology.',
      avatar_url:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      phone: '+254 722 849 102',
      assignment_confirmed: true,
    },
    itinerary: [
      {
        day: 1,
        title: 'Mombasa Coastal Arrival & Swahili Welcome',
        location: 'Bamburi Beach Ridge / Serena Beach',
        morning: 'VIP airport reception at Moi International Airport (MBA). Executive transfer to private beachfront resort.',
        afternoon: 'Relax by the Indian Ocean. Briefing with Master Guide Jackson on expedition safety, route topography and optical equipment.',
        evening: 'Fresh tamarind dhow dinner overlooking the Tudor Creek.',
        meals: 'Dinner included',
        accommodation: 'Serena Beach Resort & Spa (Ocean Front Suite)',
      },
      {
        day: 2,
        title: 'Journey to the Red Dust of Tsavo East',
        location: 'Tsavo East National Park',
        morning: '06:00 depart Mombasa towards Bachuma Gate. First game drive across the iron-red soil plains.',
        afternoon: 'Game drive tracking red dust elephant herds along the Galana River. Exploration of Lugard Falls.',
        evening: 'Campfire sundowner with views across Mudanda Rock waterhole.',
        meals: 'Breakfast, Lunch, Dinner',
        accommodation: 'Ashnil Aruba Luxury Tented Camp',
      },
      {
        day: 3,
        title: 'Tsavo West Springs & Chyulu Vistas',
        location: 'Tsavo West National Park',
        morning: 'Transit into Tsavo West. Visit underwater hippo & crocodile observatory at Mzima Springs.',
        afternoon: 'Shetani black lava flow walk and search for Tsavo black rhino sanctuary residents.',
        evening: 'Dinner on open deck beneath starry African sky.',
        meals: 'Breakfast, Lunch, Dinner',
        accommodation: 'Kilaguni Serena Safari Lodge',
      },
      {
        day: 4,
        title: 'Amboseli Kilimanjaro Awakening',
        location: 'Amboseli National Park',
        morning: 'Drive towards the Amboseli Basin with towering snows of Mount Kilimanjaro on the horizon.',
        afternoon: 'Afternoon swamp drive among massive herds of Amboseli Big Tuskers bathing in emerald waters.',
        evening: 'Sundowner on Observation Hill followed by bush dinner.',
        meals: 'Breakfast, Lunch, Dinner',
        accommodation: 'Tortilis Camp Amboseli',
      },
    ],
    private_photos: [
      {
        id: 'p-1',
        caption: 'Tsavo red elephant herd bathing at Aruba Dam',
        location: 'Tsavo East National Park',
        captured_at: '2026-11-20',
        image_url:
          'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=800&q=80',
        photographer: 'Amber Plains Field Team',
      },
      {
        id: 'p-2',
        caption: 'Jackson spotting cheetah pride on Yatta ridge',
        location: 'Tsavo East',
        captured_at: '2026-11-20',
        image_url:
          'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=800&q=80',
        photographer: 'Jackson Ole Lenku',
      },
    ],
    change_requests: [],
    created_at: '2026-10-15T09:30:00Z',
  },
  {
    id: 'bk-enquiry-302',
    reference_number: 'AP-2026-ENQ302',
    guest_id: 'guest-director-1',
    guest_name: 'Dr. Jane Somerville',
    guest_email: 'jane.somerville@oxford.ac.uk',
    package_title: 'Maasai Mara Migration Wing Safari',
    destinations: ['Maasai Mara National Reserve'],
    start_date: '2027-01-14',
    end_date: '2027-01-20',
    duration_days: 6,
    adults: 2,
    children: 1,
    accommodation_tier: 'Exclusive Bush Villa',
    status: 'enquiry',
    total_amount_usd: 9900,
    paid_amount_usd: 0,
    currency: 'USD',
    pickup_instructions:
      'Pending company confirmation upon final reservation and lodge booking.',
    transfer_option: AIRPORT_TRANSFERS[1],
    // Vehicle and Guide assignments are NOT confirmed yet
    assigned_vehicle: {
      model: 'Pending Assignment',
      plate_number: 'TBD',
      type: 'Custom 4x4 Cruiser (Allocated 7 days prior)',
      features: ['Pop-up roof', 'Cooler box', 'VHF Radio'],
      pop_up_roof: true,
      vhf_radio: true,
      charging_ports: true,
      refrigerated_cooler: true,
      photo_url: '',
      assignment_confirmed: false,
    },
    assigned_guide: {
      name: 'Guide Assignment in Progress',
      kpsga_badge: 'Silver',
      languages: ['English', 'Swahili'],
      experience_years: 0,
      bio: 'Your expert KPSGA certified guide will be officially assigned once lodge vouchers and park clearances are finalized.',
      avatar_url: '',
      phone: '',
      assignment_confirmed: false,
    },
    itinerary: [
      {
        day: 1,
        title: 'Coastal Flight to Mara North',
        location: 'Mara North Conservancy',
        morning: 'Board charter scenic flight from Diani or Mombasa directly into Mara North Airstrip.',
        afternoon: 'Camp check-in and premier afternoon game drive in Mara private concession.',
        evening: 'Gourmet bush dinner with fireside safari tales.',
        meals: 'Lunch, Dinner',
        accommodation: 'Mara Bush Villa (Private Exclusive Concession)',
      },
    ],
    private_photos: [],
    change_requests: [],
    created_at: '2026-11-22T14:10:00Z',
  },
];
