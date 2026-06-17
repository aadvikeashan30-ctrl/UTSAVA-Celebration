# UTSAVA Celebration 🎉

A mobile-first event-planning & banquet booking web app for **UTSAVA Celebration**, Bingetown, Bangalore.

> *Where every moment becomes a memory.*

## ✨ Features

Inspired by leading private-theatre celebration apps (e.g. The Binge Town), tailored to UTSAVA's hall + event-planning business.

- **Festive, attractive UI** — Indian celebration theme (maroon · rose · gold) with confetti, scroll reveals and a polished mobile app feel.
- **12 occasions** — Birthday, Anniversary, Marriage, Bride/Groom-to-be, Baby shower, Naming ceremony, Proposal, Romantic date, Old age party, Send-off, Reunion, Just-for-fun.
- **Two venues with people-based packages** — Private Theatre (base price + per-extra-guest) and The Grand Hall.
- **Rich add-ons** — Designer cake, photography, fog entry, cold pyro/sparklers, LED name/number, rose-petal path, candle path, bouquet, sash & crown, premium decoration.
- **Smart 4-step booking flow** — occasion → venue + guest stepper + add-ons → date/slot + details + coupon → review & pay.
- **Coupon codes** — FLAT500, UTSAVA10, FIRST100 with live discount on the estimate.
- **Advance payment breakdown** — 25% advance to confirm + balance at venue.
- **Time slots from the brief** — 9 AM–4 PM (2 hr) and 4 PM–11 PM (1½ hr), open all 7 days, plus hourly & half-day packages.
- **Trust elements** — stats banner, "How it works" steps, customer reviews (4.9★) and FAQ.
- **Services showcase** — Hall, Decoration, Flower & Balloon decoration, Lighting, Sound systems, Catering.
- **WhatsApp / call / email** quick contact + bookings saved to `localStorage` with a reference number.

## 📁 Project Structure

```
UTSAVA-Celebration/
├── index.html        # App markup & sections
├── css/
│   └── styles.css    # Festive mobile-first theme
└── js/
    ├── data.js       # All content (services, events, venues, slots…)
    └── app.js        # Rendering + interactive booking flow
```

## 🚀 Run locally

It's a static site with **no build step or dependencies**. Open `index.html` directly, or serve it:

```bash
# any static server works
python3 -m http.server 8080
# then visit http://localhost:8080
```

## 📞 Contact (in-app)

- **Phone:** +91 88840 00556
- **Email:** utsavcelebration@gmail.com
- **Location:** Bingetown, Bangalore
- **Hours:** Open 7 days · 9:00 AM – 11:00 PM

## 📱 Going native (iOS & Android)

This web app is structured as a clean PWA-ready foundation. To ship to the App Store / Play Store, wrap it with [Capacitor](https://capacitorjs.com/):

```bash
npm init @capacitor/app
npx cap add ios
npx cap add android
```

Then copy `index.html`, `css/` and `js/` into the Capacitor `www/` folder.
