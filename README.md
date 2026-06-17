# UTSAVA Celebration 🎉

A mobile-first event-planning & banquet booking web app for **UTSAVA Celebration**, Bingetown, Bangalore.

> *Where every moment becomes a memory.*

## ✨ Features

- **Festive, attractive UI** — Indian celebration theme (maroon · rose · gold) with confetti, scroll reveals and a polished mobile app feel.
- **Services showcase** — Hall, Decoration, Flower & Balloon decoration, Lighting, Sound systems, Catering.
- **Event types** — Birthday, Marriage, Old age party, Marriage anniversary, Naming ceremony, Send-off.
- **Two venues** — The Theater (intimate) & The Grand Hall (large banquet).
- **Add-ons** — Cakes, Photo shooting, Additional decoration.
- **Smart booking flow** — 4-step booking with live price estimate, date picker, time slots and validation.
- **Time slots from the brief** — 9 AM–4 PM (2 hr) and 4 PM–11 PM (1½ hr), open all 7 days, plus hourly & half-day packages for the big hall.
- **Bookings saved locally** — confirmed requests are stored in `localStorage` with a reference number.

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
