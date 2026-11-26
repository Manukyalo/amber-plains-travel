/**
 * East African Safari Geographic Reference Data
 * Adapted from Axelo's parkBoundaries, lodgesData, and gatesData for Amber Plains.
 * Coordinates are [longitude, latitude] for MapLibre GL.
 */

export interface GeoPark {
  id: string;
  name: string;
  center: [number, number];
  zoom: number;
  description: string;
}

export interface GeoLodge {
  id: string;
  name: string;
  parkId: string;
  parkName: string;
  center: [number, number];
  stars: number;
  description: string;
}

export interface GeoGate {
  id: string;
  name: string;
  parkId: string;
  parkName: string;
  center: [number, number];
  openHours: string;
  direction: string;
}

export const KENYA_SAFARI_PARKS: GeoPark[] = [
  {
    id: "tsavo_east",
    name: "Tsavo East National Park",
    center: [38.45, -2.9833],
    zoom: 8,
    description: "Kenya's largest park; red-dust elephants & Yatta Plateau.",
  },
  {
    id: "tsavo_west",
    name: "Tsavo West National Park",
    center: [37.95, -3.2],
    zoom: 8,
    description: "Volcanic landscapes, Mzima Springs & Shetani lava flows.",
  },
  {
    id: "amboseli",
    name: "Amboseli National Park",
    center: [37.2536, -2.6527],
    zoom: 10,
    description: "Tuskers & wetlands beneath Mount Kilimanjaro.",
  },
  {
    id: "maasai_mara",
    name: "Maasai Mara National Reserve",
    center: [35.1431, -1.5031],
    zoom: 9,
    description: "Great Migration river crossings & big cat conservancies.",
  },
  {
    id: "samburu",
    name: "Samburu National Reserve",
    center: [37.5458, 0.6358],
    zoom: 9,
    description: "Ewaso Ng'iro river & Samburu Special Five.",
  },
  {
    id: "lake_nakuru",
    name: "Lake Nakuru National Park",
    center: [36.0833, -0.3667],
    zoom: 10,
    description: "Rift Valley soda lake, rhino sanctuary & Rothschild giraffes.",
  },
  {
    id: "aberdare",
    name: "Aberdare National Park",
    center: [36.6667, -0.4],
    zoom: 9,
    description: "Montane cloud forest, bamboo ridges & waterhole lodges.",
  },
  {
    id: "mount_kenya",
    name: "Mount Kenya National Park",
    center: [37.3167, -0.15],
    zoom: 9,
    description: "UNESCO World Heritage alpine massif.",
  },
  {
    id: "meru",
    name: "Meru National Park",
    center: [38.1833, 0.0833],
    zoom: 9,
    description: "Uncrowded riverine wilderness & rhino sanctuary.",
  },
  {
    id: "nairobi_np",
    name: "Nairobi National Park",
    center: [36.85, -1.3667],
    zoom: 11,
    description: "Savannah wildlife sanctuary on Nairobi's southern boundary.",
  },
  {
    id: "mombasa_coast",
    name: "Mombasa & Diani Coast",
    center: [39.6682, -4.0435],
    zoom: 10,
    description: "Amber Plains HQ (Bamburi) & Swahili Coast beach departures.",
  },
];

export const KENYA_SAFARI_LODGES: GeoLodge[] = [
  {
    id: "satao_camp",
    name: "Satao Tented Camp",
    parkId: "tsavo_east",
    parkName: "Tsavo East",
    center: [38.688, -3.275],
    stars: 4,
    description: "Iconic waterhole-facing luxury tents in Tsavo East.",
  },
  {
    id: "salt_lick",
    name: "Salt Lick Safari Lodge",
    parkId: "tsavo_west",
    parkName: "Tsavo West",
    center: [38.203, -3.553],
    stars: 5,
    description: "Elevated stilt rooms over active Taita Hills watering holes.",
  },
  {
    id: "tortilis_camp",
    name: "Tortilis Camp Amboseli",
    parkId: "amboseli",
    parkName: "Amboseli",
    center: [37.237, -2.695],
    stars: 5,
    description: "Elewana luxury tented camp facing Kilimanjaro.",
  },
  {
    id: "governors_camp",
    name: "Governor's Camp",
    parkId: "maasai_mara",
    parkName: "Maasai Mara",
    center: [35.0044, -1.2647],
    stars: 5,
    description: "Legendary Mara River tented camp.",
  },
  {
    id: "angama_mara",
    name: "Angama Mara",
    parkId: "maasai_mara",
    parkName: "Maasai Mara",
    center: [35.0472, -1.2139],
    stars: 5,
    description: "Clifftop luxury lodge overlooking the Mara Triangle.",
  },
  {
    id: "mara_serena",
    name: "Mara Serena Safari Lodge",
    parkId: "maasai_mara",
    parkName: "Maasai Mara",
    center: [35.0408, -1.4089],
    stars: 5,
    description: "Panoramic hilltop lodge in the Mara Triangle.",
  },
];

export const KENYA_KWS_GATES: GeoGate[] = [
  {
    id: "voi_gate",
    name: "Voi Gate",
    parkId: "tsavo_east",
    parkName: "Tsavo East",
    center: [38.55, -3.4],
    openHours: "06:00 - 18:00",
    direction: "Main entrance off Mombasa–Nairobi Highway",
  },
  {
    id: "buchuma_gate",
    name: "Buchuma Gate",
    parkId: "tsavo_east",
    parkName: "Tsavo East",
    center: [38.9167, -3.9],
    openHours: "06:00 - 18:00",
    direction: "Southern coastal entry from Mombasa",
  },
  {
    id: "mtito_andei_gate",
    name: "Mtito Andei Gate",
    parkId: "tsavo_west",
    parkName: "Tsavo West",
    center: [38.1667, -2.6833],
    openHours: "06:00 - 18:00",
    direction: "Northern Tsavo West highway entrance",
  },
  {
    id: "kimana_gate",
    name: "Kimana Gate",
    parkId: "amboseli",
    parkName: "Amboseli",
    center: [37.5167, -2.7333],
    openHours: "06:00 - 18:00",
    direction: "Eastern Amboseli access from Tsavo",
  },
  {
    id: "sekenani_gate",
    name: "Sekenani Gate",
    parkId: "maasai_mara",
    parkName: "Maasai Mara",
    center: [35.3028, -1.5444],
    openHours: "06:00 - 18:00",
    direction: "Main Maasai Mara entrance from Narok",
  },
];
