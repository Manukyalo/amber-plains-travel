# Amber Plains Travel — Platform Architecture & Documentation

A digital operating platform for **Amber Plains Travel Ltd**, a Mombasa-based luxury tour operator specializing in bespoke East African safaris that bridge Kenya’s Swahili coast with the interior wilderness of Tsavo, Amboseli, and the Maasai Mara.

---

## 1. System Overview

The platform is designed in two complementary layers:
1. **Phase 1: Public Marketing & Package Discovery Website**
   - High-contrast editorial luxury serif typography (`Cormorant Garamond`), full-bleed cinematic safari photography, minimal navigation, structured package discovery, interactive itineraries, travel styles, and guest companion app promotion.
2. **Phase 2: Admin Dashboard & Business Control Centre**
   - High-density operating interface and CMS powering bookings, costing/profit protection, fleet allocation, supplier contract management, multi-gateway payments, AI voice telephony lead capture, competitor intelligence, and SEO engine.

---

## 2. Phase 2 Admin Dashboard Modules (`/admin`)

| Module | Route | Operational Scope |
| :--- | :--- | :--- |
| **Command Center Overview** | `/admin` | Real-time booking pipeline, revenue metrics ($34,700 confirmed), outstanding balances, upcoming field departures calendar, fleet utilization, and actionable operational alerts. |
| **Website CMS & App Distribution** | `/admin/cms` | Direct CMS management for hero titles, editorial copy, package publication, official iOS/Android store URLs, app live status toggling, and downloadable stable QR artwork (SVG & PNG). |
| **Packages & Itineraries** | `/admin/packages` | Catalog portfolio management, day-by-day itineraries, guest limits, difficulty levels, seasonal availability, and public link inspection. |
| **Bookings & Client CRM** | `/admin/bookings` | Lead pipeline stages (`new_inquiry`, `scoping`, `quote_drafted`, `quote_sent`, `deposit_pending`, `confirmed`, `in_safari`, `completed`, `cancelled`), guest profiles, confidential staff communications log, and WhatsApp direct link. |
| **Supplier Contracts & Net Rates** | `/admin/suppliers` | Hotels/lodges (Satao Camp Tsavo, Tortilis Camp Amboseli), aviation charters (Safarilink), net room rates, room categories, meal plans, seasons, blackout dates, and PDF contract review verification. |
| **Costing & Pricing Engine** | `/admin/costing` | Deterministic margin/markup calculator, separate cost categories, configurable contingency buffer (e.g. 5%), markup vs gross margin formulas, minimum profit threshold gate (e.g. 18%), and confidential staff breakdown vs guest-facing quote generator. |
| **4x4 Safari Fleet** | `/admin/fleet` | Custom extended Land Cruisers (KDE 412X, KDG 893L), window seat capacities, equipment (inverters, fridges, pop-up roofs), mileage, service intervals, and trip scheduling. |
| **Drivers & Guides** | `/admin/guides` | KPSGA certified naturalists (Gold, Silver, Bronze), license numbers, language proficiencies, assignment status, and Driver App link. |
| **Payments & Treasury** | `/admin/payments` | Multi-gateway state machine (`pending` -> `processing` -> `succeeded` / `failed` -> `refunded`), idempotency key verification, provider references (Stripe, M-Pesa, IntaSend), and immutable audit ledger. |
| **Safari Merchandise** | `/admin/merchandise` | Gear inventory (wide-brim safari hats, canvas photography vests, bush canteens), cost/retail tracking, stock alerts, and fulfillment. |
| **AI Receptionist & Telephony** | `/admin/receptionist` | Telephony integration (Twilio / Africa's Talking / SIP), missed-call overflow, caller consent verification, automated structured intent extraction (dates, party, budget), draft quote staging, and human escalation. |
| **Website Hunter** | `/admin/hunter` | Competitor watchlist (Pollman's, Micato), ethical public crawls (respects robots.txt), observed pricing ranges, separated facts vs opportunities vs AI recommendations with effort/impact scoring. |
| **SEO Engine** | `/admin/seo` | Search Console status, audited URLs, meta title/description length monitoring, structured Schema.org (`TravelAgency` and `TouristTrip`), and organic keyword rankings. |
| **Governance & Settings** | `/admin/settings` | Role-Based Access Control (Super Admin, Safari Director, Operations, Finance, Guide), base quoting currency (USD, KES, EUR, GBP), Kenya statutory levies (VAT 16%, Catering Levy 2%), and immutable security audit stream. |

---

## 3. Costing Engine & Profit Protection Formula

The platform strictly separates **Markup Rate** from **Gross Margin**:
- **Markup Pricing Formula:**
  $$\text{Selling Price} = \text{Effective Cost} \times (1 + \text{Markup Rate})$$
- **Gross Margin Formula:**
  $$\text{Gross Margin} = \frac{\text{Selling Price} - \text{Effective Cost}}{\text{Selling Price}}$$

> **Important:** A 28% markup yields a **21.88% gross margin**.  
> If an operator enters a target gross margin, the engine solves for markup:
> $$\text{Markup Rate} = \frac{\text{Desired Margin}}{1 - \text{Desired Margin}}$$

### Profitability Threshold Enforcement
- Enforces a configurable minimum gross margin (default: **18%**).
- Quotes falling below threshold trigger explicit warnings and require Director sign-off before committing.
- Generates a **confidential staff breakdown** displaying net rates and supplier contract versions alongside a **guest-friendly quote** that scrubs confidential supplier rates.

---

## 4. Payment System Integrity

- **Idempotency Everywhere:** Every payment initiation carries a unique `idempotencyKey`. Duplicate submissions return cached idempotent records without double-charging.
- **Never Trust Client-Side Amounts:** Transaction values are calculated and verified server-side.
- **Webhook-Driven State:** Payment status is only updated from verified provider callbacks (Stripe, M-Pesa Express, IntaSend), never from optimistic frontend responses.
- **State Machine:** Explicit enum states (`pending`, `processing`, `succeeded`, `failed`, `refunded`) with timestamps.
- **Integer Currency:** All money math is handled in integer cents to prevent floating-point roundoff issues.

---

## 5. Development & Production Build

### Setup
```bash
# Clone the repository
git clone https://github.com/Manukyalo/amber-plains-travel.git
cd amber-plains-travel

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
```

### Run Locally
```bash
# Start Next.js development server
npm run dev

# Run TypeScript type check
npm run typecheck

# Execute optimized production build (53 pages)
npm run build
npm run start
```
- **Public Marketing Website:** [http://localhost:3000](http://localhost:3000)
- **Admin Control Center:** [http://localhost:3000/admin](http://localhost:3000/admin)
