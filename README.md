# UTSAVA Celebration 🎉

A complete, market-grade **celebration booking application** for **UTSAVA Celebration**,
Bingetown, Bangalore — private-theatre experiences + banquet/event planning.

> *Turning moments into memories.*

Built as a dependency-free, installable **PWA / single-page app** (vanilla HTML/CSS/JS).
See **[DESIGN.md](DESIGN.md)** for the full high-level design and market analysis.

---

## ✨ Features

**Discovery**
- Multi-view SPA: Home · Occasions · Venues · Gallery · My Bookings (hash router)
- 12 occasions, venue catalog with ratings & amenities, filterable gallery, occasion search
- Scrolling offers ticker

**Booking (4-step wizard)**
1. Occasion → 2. Venue + guest count + add-ons → 3. Date / slot / details / coupon → 4. Review & pay
- **People-based pricing**: base package + per-extra-guest charges
- **10 add-ons** with quantity steppers (cake, photography, fog, pyro, LED, petal/candle path, bouquet, sash, premium decor)
- **Real-time slot availability** — booked slots are disabled; double-booking is prevented
- **Coupons** (FLAT500, UTSAVA10, FIRST100) with live discount
- **Transparent pricing** — subtotal, discount, **GST 18%**, total, **25% advance** + balance

**Post-booking**
- **My Bookings** / purchase history with status chips, **cancel**, **re-book** and **share**
- Bookings, favourites and contact profile persisted in `localStorage`

**Trust & capture**
- Stats banner, "How it works", customer reviews (4.9★), FAQ
- Quick enquiry form, floating WhatsApp, call & email deep links

**Platform**
- Installable PWA (manifest + service worker, works offline) — ready for iOS & Android
- Responsive mobile-first → tablet → desktop, accessible, reduced-motion friendly

**Premium platform upgrade (v2)**
- **New brand identity** — Utsava Celebrations elephant emblem (royal green + gold) across app, hero & PWA icon
- **Admin Dashboard** (`#/admin`, PIN-gated) — revenue & booking analytics, bookings ops with status control, **Lead CRM** (stages + call/WhatsApp), **Vendor/staff management**
- **Razorpay payment** — pay the advance to instantly confirm a booking; graceful demo-mode fallback offline
- **Food & catering packages** — per-guest menus folded into transparent pricing
- **Decoration themes** — pick a look during booking
- **Digital invitation generator** — shareable/downloadable SVG invite card per booking
- **Event progress tracker** — milestone timeline per booking
- **Video gallery & 360° tours** — preview grid on home
- **AI package recommendation** — occasion + guests + budget + vibe → a ready-to-book, budget-tuned package

> Admin demo PIN: **2468** · Razorpay uses a public **test** key — swap for a live key in production.

### Adding the real Utsava logo
The site loads the brand logo from **`icons/logo.png`** (app bar, hero, footer, PWA icon). Until that file exists it gracefully falls back to a placeholder vector. To use the real artwork, upload your image to the repo as **`icons/logo.png`** (e.g. on GitHub: open the `icons/` folder → *Add file* → *Upload files* → name it `logo.png` → commit). No code changes needed — it appears everywhere automatically.

---

## 📁 Project Structure

```
UTSAVA-Celebration/
├── index.html              # App shell + all views
├── manifest.webmanifest    # PWA metadata (installable)
├── sw.js                   # Service worker (offline cache)
├── DESIGN.md               # High-level design & market analysis
├── icons/icon.svg          # App icon
├── css/styles.css          # Festive design system (maroon · rose · gold)
├── js/
│   ├── data.js             # Catalog/content (UMD: browser + Node)
│   ├── pricing.js          # Pure pricing/availability logic (unit-tested)
│   ├── store.js            # localStorage: bookings, favourites, profile
│   └── app.js              # Router + views + booking wizard
└── tests/
    ├── pricing.test.js     # 28 unit tests (no deps)
    ├── dom-smoke.test.js   # 8 end-to-end smoke tests (DOM stub)
    └── run.sh              # Test runner
```

---

## 🚀 Run locally

No build step or dependencies. Serve the folder:

```bash
python3 -m http.server 8080
# open http://localhost:8080
```

> A static server (not `file://`) is recommended so the service worker registers.

---

## ✅ Tests

Pure logic and the full booking flow are covered by Node tests using the built-in
`assert` module (no external packages):

```bash
bash tests/run.sh
# == Unit tests ==        28 passed, 0 failed
# == DOM smoke test ==     8 passed, 0 failed
```

The smoke test loads `app.js` against a minimal DOM stub and drives the entire
4-step booking flow + confirmation, the router and slot-availability — verifying
the app runs without errors and the saved booking matches the pricing engine.

---

## 💰 Pricing model

```
venueCost  = base + max(0, guests - included) * perExtraGuest
subtotal   = venueCost + Σ(addOn.price * qty)
discount   = coupon (flat/percent, min-cart gated, capped)
gst        = round((subtotal - discount) * 18%)
total      = (subtotal - discount) + gst
advance    = round(total * 25%)   ·   balance = total - advance
```

---

## 📞 Contact (in-app)

- **Phone / WhatsApp:** +91 88840 00556
- **Email:** utsavcelebration@gmail.com
- **Location:** Bingetown, Bangalore · Open 7 days · 9:00 AM – 11:00 PM

---

## 🗺️ Roadmap (server-ready)

- Swap `localStorage` for a backend/API; integrate a payment gateway (Razorpay/Stripe)
- Admin dashboard (orders, calendar, inventory); SMS/email confirmations
- Native shells via Capacitor for the App Store & Play Store
