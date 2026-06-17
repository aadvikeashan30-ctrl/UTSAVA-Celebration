/* ============================================================
   UTSAVA Celebration — Data Layer (catalog/content)
   UMD: works as a browser global (UTSAVA) and a Node module.
   ============================================================ */
(function (root, factory) {
  const data = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = data;
  root.UTSAVA = data;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  return {
    brand: {
      name: "UTSAVA",
      tagline: "Celebration",
      motto: "Turning moments into memories",
      phone: "8884000556",
      phoneDisplay: "+91 88840 00556",
      whatsapp: "918884000556",
      email: "utsavcelebration@gmail.com",
      location: "Bingetown, Bangalore",
      address: "Bingetown, Bengaluru, Karnataka, India",
      hours: "Open all 7 days · 9:00 AM – 11:00 PM",
      gstRate: 0.18,
      advancePercent: 25,
    },

    stats: [
      { value: "10,000+", label: "Happy Celebrations" },
      { value: "4.9★",     label: "Average Rating" },
      { value: "7 Days",   label: "Open Weekly" },
      { value: "9AM–11PM", label: "Daily Hours" },
    ],

    offers: [
      "🎁 Use code FLAT500 — ₹500 off on bookings above ₹2000",
      "✨ First booking? FIRST100 gives you ₹100 off instantly",
      "💖 UTSAVA10 — flat 10% off your whole celebration",
    ],

    services: [
      { icon: "hall",     name: "Banquet Hall",        desc: "Spacious, air-conditioned halls for gatherings of every size." },
      { icon: "decor",    name: "Decoration",          desc: "Bespoke themes crafted to match your celebration." },
      { icon: "flower",   name: "Flower Decoration",   desc: "Fresh floral arrangements, garlands and stage backdrops." },
      { icon: "balloon",  name: "Balloon Decoration",  desc: "Playful balloon arches, columns and ceiling installs." },
      { icon: "light",    name: "Lighting",            desc: "Ambient, fairy and stage lighting to set the mood." },
      { icon: "sound",    name: "Sound Systems",       desc: "Crisp audio, mics and DJ-ready setups." },
      { icon: "catering", name: "Catering",            desc: "Multi-cuisine menus, live counters and desserts." },
    ],

    events: [
      { id: "birthday",    name: "Birthday",            emoji: "🎂", blurb: "Themed birthday surprises for all ages." },
      { id: "anniversary", name: "Anniversary",         emoji: "❤️", blurb: "Celebrate years of togetherness in style." },
      { id: "marriage",    name: "Marriage",            emoji: "💍", blurb: "Grand weddings with end-to-end planning." },
      { id: "bridetobe",   name: "Bride / Groom to Be", emoji: "👰", blurb: "Pre-wedding bashes & surprises." },
      { id: "babyshower",  name: "Baby Shower",         emoji: "🤱", blurb: "Warm mom-to-be celebrations." },
      { id: "naming",      name: "Naming Ceremony",     emoji: "🍼", blurb: "Traditional naming & cradle decor." },
      { id: "proposal",    name: "Proposal",            emoji: "💐", blurb: "Romantic proposals to remember." },
      { id: "romantic",    name: "Romantic Date",       emoji: "🌹", blurb: "Private candle-lit date setups." },
      { id: "oldage",      name: "Old Age Party",       emoji: "🌼", blurb: "Get-togethers honouring our elders." },
      { id: "sendoff",     name: "Send-off / Farewell", emoji: "🎓", blurb: "Memorable farewells & send-offs." },
      { id: "reunion",     name: "Reunion",             emoji: "🎉", blurb: "Friends & family get-togethers." },
      { id: "movie",       name: "Just for Fun",        emoji: "🍿", blurb: "Private movie & binge sessions." },
    ],

    venues: [
      {
        id: "theater",
        name: "Private Theatre",
        capacity: "2 – 12 guests",
        size: "Intimate screening hall",
        desc: "A private, screen-equipped theatre — perfect for surprises, dates, birthdays & small celebrations.",
        basePackage: 1499,
        includesPeople: 4,
        extraPerPerson: 200,
        maxPeople: 12,
        decorationIncluded: true,
        rating: 4.9,
        reviews: 1280,
        theme: "g-rose",
        amenities: ["4K screen", "Dolby sound", "Decoration included", "AC", "Cosy seating", "Parking"],
        tags: ["Decoration included", "Big screen", "Dolby sound", "AC"],
      },
      {
        id: "hall",
        name: "The Grand Hall",
        capacity: "Up to 350 guests",
        size: "35 m banquet hall",
        desc: "Our flagship banquet hall for weddings, anniversaries and large celebrations.",
        basePackage: 12000,
        includesPeople: 50,
        extraPerPerson: 150,
        maxPeople: 350,
        decorationIncluded: false,
        rating: 4.8,
        reviews: 540,
        theme: "g-indigo",
        amenities: ["Large stage", "Valet parking", "AC", "Green rooms", "Catering kitchen", "Sound & lights"],
        tags: ["Spacious", "Stage", "Parking", "AC"],
      },
    ],

    addOns: [
      { id: "cake",       name: "Designer Cake",     icon: "cake",   desc: "Custom cake, any flavour.",       price: 600,  unit: "per 0.5 kg", hasQty: true,  max: 10 },
      { id: "photo",      name: "Photography",       icon: "cam",    desc: "Photo & video coverage.",         price: 1500, unit: "per hour",   hasQty: true,  max: 8 },
      { id: "fog",        name: "Fog Entry Effect",  icon: "spark",  desc: "Dramatic smoke entry.",           price: 500,  unit: "per round",  hasQty: true,  max: 5 },
      { id: "pyro",       name: "Cold Pyro",         icon: "spark",  desc: "Indoor sparkler shots.",          price: 700,  unit: "per pair",   hasQty: true,  max: 5 },
      { id: "led",        name: "LED Name / Number", icon: "light",  desc: "Glowing name or age letters.",    price: 400,  unit: "set",        hasQty: false, max: 1 },
      { id: "petal",      name: "Rose Petal Path",   icon: "flower", desc: "Romantic flower-petal walkway.",  price: 350,  unit: "set",        hasQty: false, max: 1 },
      { id: "candle",     name: "Candle Path",       icon: "light",  desc: "Warm candle-lit pathway.",        price: 300,  unit: "set",        hasQty: false, max: 1 },
      { id: "bouquet",    name: "Flower Bouquet",    icon: "flower", desc: "Fresh hand-tied bouquet.",        price: 450,  unit: "each",       hasQty: true,  max: 5 },
      { id: "sash",       name: "Sash & Crown",      icon: "spark",  desc: "Birthday / bride-to-be set.",     price: 250,  unit: "set",        hasQty: false, max: 1 },
      { id: "extradecor", name: "Premium Decoration",icon: "decor",  desc: "Upgraded themed decor.",          price: 1500, unit: "package",    hasQty: false, max: 1 },
    ],

    packages: [
      { id: "morning",  name: "Morning Slot",      window: "9:00 AM – 4:00 PM",  slot: "2 hour slots",     note: "Best for daytime functions" },
      { id: "evening",  name: "Evening Slot",      window: "4:00 PM – 11:00 PM", slot: "1½ hour slots",    note: "Perfect for evening parties" },
      { id: "hourly",   name: "Hourly (Big Hall)", window: "Flexible hours",     slot: "Pay per hour",     note: "Grand Hall, billed hourly" },
      { id: "halfday",  name: "Half Day",          window: "Up to 6 hours",      slot: "Half-day package", note: "Great value for big events" },
    ],

    slots: {
      morning: ["09:00 – 11:00", "11:00 – 13:00", "13:00 – 15:00"],
      evening: ["16:00 – 17:30", "17:30 – 19:00", "19:00 – 20:30", "20:30 – 22:00", "22:00 – 23:00"],
    },

    coupons: [
      { code: "FLAT500",  type: "flat",    value: 500, min: 2000, label: "₹500 off on bookings above ₹2000" },
      { code: "UTSAVA10", type: "percent", value: 10,  min: 0,    label: "10% off your celebration" },
      { code: "FIRST100", type: "flat",    value: 100, min: 0,    label: "₹100 off for first-timers" },
    ],

    howItWorks: [
      { icon: "calendar", title: "Pick Occasion", text: "Choose what you're celebrating." },
      { icon: "decor",    title: "Customize",     text: "Select venue, guests & add-ons." },
      { icon: "shield",   title: "Book & Pay",    text: "Confirm your slot with a small advance." },
      { icon: "heart",    title: "Celebrate",     text: "Arrive & enjoy — we handle the rest." },
    ],

    gallery: [
      { title: "Theatre Birthday", theme: "g-rose",   tag: "birthday" },
      { title: "Balloon Arch",     theme: "g-violet", tag: "birthday" },
      { title: "Floral Stage",     theme: "g-green",  tag: "wedding" },
      { title: "Candle-lit Date",  theme: "g-amber",  tag: "romantic" },
      { title: "Naming Cradle",    theme: "g-teal",   tag: "naming" },
      { title: "Wedding Mandap",   theme: "g-indigo", tag: "wedding" },
      { title: "Anniversary Setup",theme: "g-rose",   tag: "romantic" },
      { title: "Baby Shower",      theme: "g-teal",   tag: "naming" },
      { title: "Proposal Decor",   theme: "g-amber",  tag: "romantic" },
    ],

    galleryFilters: [
      { id: "all",      label: "All" },
      { id: "birthday", label: "Birthday" },
      { id: "romantic", label: "Romantic" },
      { id: "wedding",  label: "Wedding" },
      { id: "naming",   label: "Naming" },
    ],

    reviews: [
      { name: "Priya S.",   rating: 5, text: "Booked a surprise birthday in the private theatre — decoration and fog entry were stunning! Smooth booking too.", tag: "Birthday" },
      { name: "Arjun M.",   rating: 5, text: "Perfect anniversary setup. The candle path and bouquet add-ons made it so special. Highly recommend.", tag: "Anniversary" },
      { name: "Sneha R.",   rating: 5, text: "Our naming ceremony at the Grand Hall was beautifully done. Catering and lighting were top class.", tag: "Naming Ceremony" },
      { name: "Karthik V.", rating: 4, text: "Great value with the FLAT500 coupon. Team was responsive and on time. Will book again!", tag: "Proposal" },
      { name: "Divya N.",   rating: 5, text: "The baby shower decor exceeded expectations. Loved how easy it was to pick add-ons online.", tag: "Baby Shower" },
    ],

    highlights: [
      { icon: "calendar", title: "Open 7 Days",   text: "9 AM to 11 PM, every single day." },
      { icon: "shield",   title: "End-to-End",    text: "From decor to dinner, we handle it all." },
      { icon: "star",     title: "Custom Themes", text: "Tailored to your taste and budget." },
      { icon: "heart",    title: "Trusted Team",  text: "10,000+ happy celebrations in Bangalore." },
    ],

    faq: [
      { q: "How do I book a celebration?", a: "Tap “Book Now”, pick your occasion, venue, guests, date & add-ons, apply any coupon, then confirm with a small advance. Our team calls you to finalise." },
      { q: "Is decoration included?", a: "Yes — the Private Theatre package includes standard decoration. The Grand Hall has decoration as an add-on so you can fully customise." },
      { q: "Can I bring my own cake or order one?", a: "You can add a designer cake during booking, or bring your own. Outside food rules vary by venue." },
      { q: "What is the advance payment?", a: "We collect 25% of the estimated total as advance to confirm your slot. The balance is paid before the event." },
      { q: "Can I cancel or reschedule?", a: "Yes — manage your booking under “My Bookings”. Cancellations follow our policy; reach out and we'll help reschedule." },
      { q: "What are your timings?", a: "Open all 7 days, 9 AM to 11 PM. Morning slots are 2 hours and evening slots are 1½ hours." },
    ],
  };
});
