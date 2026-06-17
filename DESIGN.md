# UTSAVA Celebration — High-Level Design

A complete, market-grade celebration booking application for **UTSAVA Celebration**
(Bingetown, Bangalore) — private-theatre experiences + banquet/event planning.

> Goal: let customers discover, customise and book a celebration in a few taps, and
> help the business capture leads and confirmed orders.

---

## 1. Market Analysis (feature benchmark)

Studied private-theatre brands (The Binge Town, Binge Vibe, GoodTyms) and venue/event
booking platforms (VenueLook, Perfect Venue, BookMyShow, SpacetoCo, Fever). Recurring,
must-have capabilities — de-duplicated into a single coherent set:

| Theme | What we adopted |
|---|---|
| Discovery | Occasions grid, venue catalog, gallery, search & filter |
| Mobile-first flow | 4-step booking wizard, sticky CTAs, bottom nav, install as app (PWA) |
| Packages | People-based pricing (base + per extra guest), morning/evening/hourly/half-day |
| Add-ons / extras | Cake, photography, fog, pyro, LED, petal/candle path, bouquet, sash, decor — with quantity |
| Availability | Per-venue, per-date slot availability; booked slots disabled (no double-booking) |
| Offers | Coupon codes with flat/percent + minimum-cart rules; offers banner |
| Transparent pricing | Itemised subtotal, discount, GST (18%), total, advance (25%) + balance |
| Payments | Advance-to-confirm model with balance-at-venue (gateway-ready) |
| Post-booking | My Bookings / purchase history, status tracking, cancel, re-book, share |
| Trust | Ratings & reviews, stats, "How it works", FAQ |
| Capture | Quick enquiry, WhatsApp/call deep links, newsletter |
| Personalisation | Favourites/wishlist, remembered contact details |

---

## 2. Architecture

A dependency-free, **mobile-first PWA / SPA** in vanilla HTML/CSS/JS — chosen because the
build sandbox has no external package network, and because it ships everywhere instantly
and is installable on iOS & Android.

```
index.html              App shell + all views (hidden/shown by router)
css/styles.css          Festive design system (maroon · rose · gold)
js/data.js              Content & catalog (UMD: browser global + Node export)
js/pricing.js           Pure pricing/availability/coupon logic (UMD, unit-tested)
js/store.js             localStorage: bookings, favourites, profile, slot locks
js/app.js               Router + view rendering + booking wizard wiring
manifest.webmanifest    PWA metadata (installable)
sw.js                   Service worker (offline cache)
tests/pricing.test.js   Node test suite (built-in assert, no deps)
```

### Layers
- **Data layer** (`data.js`) — immutable catalog: brand, services, occasions, venues,
  add-ons, packages, slots, coupons, reviews, FAQ.
- **Domain layer** (`pricing.js`) — pure functions: `venueCost`, `addOnsCost`,
  `couponDiscount`, `gst`, `compute(...)`, `availableSlots(...)`. No DOM, fully testable.
- **Persistence** (`store.js`) — safe localStorage wrapper (bookings, favourites, profile)
  with try/catch fallbacks.
- **Presentation** (`app.js`) — hash router, render functions per view, booking wizard.

### Routing (hash-based)
`#/home` · `#/occasions` · `#/venues` · `#/gallery` · `#/bookings` (My Bookings).
Unknown routes fall back to home. Each view is a section toggled via `hidden`.

---

## 3. Data Model

```
Venue      { id, name, capacity, size, desc, basePackage, includesPeople,
             extraPerPerson, maxPeople, decorationIncluded, tags, rating }
Occasion   { id, name, emoji, blurb }
AddOn      { id, name, icon, desc, price, unit, hasQty }
Coupon     { code, type:'flat'|'percent', value, min, label }
Slot       "HH:MM – HH:MM"  (morning=2h, evening=1.5h)
Booking    { ref, occasion, venue, guests, date, slot, addOns:[{id,qty}],
             coupon, pricing:{subtotal,discount,gst,total,advance,balance},
             name, phone, email, notes, status, createdAt }
Status     'requested' | 'confirmed' | 'completed' | 'cancelled'
```

---

## 4. Pricing Model

```
venueCost   = basePackage + max(0, guests - includesPeople) * extraPerPerson
addOnsCost  = Σ (addOn.price * qty)
subtotal    = venueCost + addOnsCost
discount    = coupon ? (flat: value, percent: subtotal*value/100), capped, min-cart gated
taxable     = subtotal - discount
gst         = round(taxable * 0.18)
total       = taxable + gst
advance     = round(total * 0.25)      // pay-to-confirm
balance     = total - advance
```

All monetary math is centralised in `pricing.js` and covered by unit tests.

---

## 5. Availability (no double-booking)

Each confirmed/requested booking stores `{venue, date, slot}`. When a user opens the
date/slot step, `availableSlots(venue, date, existingBookings)` filters out already-taken
slots; taken slots render disabled. This simulates real-time availability locally and is
gateway/back-end ready.

---

## 6. Screens

1. **Home** — hero + offers banner, stats, occasions, how-it-works, featured venues,
   services, add-ons, gallery preview, reviews, FAQ, contact.
2. **Occasions** — full grid; tap to start booking.
3. **Venues** — catalog with details, amenities, rating, favourite, "Book".
4. **Gallery** — filterable inspiration grid.
5. **My Bookings** — purchase history with status chips, cancel, re-book, share.
6. **Booking wizard (modal)** — Occasion → Venue+Guests+Add-ons → Date/Slot/Details/Coupon
   → Review & Pay → Confirmation.

---

## 7. Non-functional

- **Responsive** mobile-first → tablet → desktop breakpoints.
- **Accessible** — semantic landmarks, ARIA on modal, keyboard (Esc) close, reduced-motion.
- **Performant** — no frameworks, lazy reveal via IntersectionObserver, cached by SW.
- **Resilient** — localStorage guarded; app works offline after first load.
- **Testable** — domain logic isolated and unit-tested in Node (`npm test`-style script).

---

## 8. Roadmap (server-ready hooks)

- Replace localStorage with REST/Firebase; wire real payment gateway (Razorpay/Stripe).
- Admin dashboard for orders, calendar and inventory.
- SMS/email confirmations; Google reviews integration; multi-branch support.
- Native shells via Capacitor for App Store / Play Store.
