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
      tagline: "Celebrations",
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
      razorpayKey: "rzp_test_1DP5mmOlF5G5ag", // public test key — swap for live key in production
      adminPin: "2468", // demo admin gate
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
      { id: "birthday",    name: "Birthday",            emoji: "🎂", blurb: "Themed birthday surprises for all ages.", img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=600&q=80" },
      { id: "anniversary", name: "Anniversary",         emoji: "❤️", blurb: "Celebrate years of togetherness in style.", img: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=600&q=80" },
      { id: "marriage",    name: "Marriage",            emoji: "💍", blurb: "Grand weddings with end-to-end planning.", img: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80" },
      { id: "bridetobe",   name: "Bride / Groom to Be", emoji: "👰", blurb: "Pre-wedding bashes & surprises.", img: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=600&q=80" },
      { id: "babyshower",  name: "Baby Shower",         emoji: "🤱", blurb: "Warm mom-to-be celebrations.", img: "https://images.unsplash.com/photo-1530891910412-92a4a0f7c3a1?auto=format&fit=crop&w=600&q=80" },
      { id: "naming",      name: "Naming Ceremony",     emoji: "🍼", blurb: "Traditional naming & cradle decor.", img: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80" },
      { id: "proposal",    name: "Proposal",            emoji: "💐", blurb: "Romantic proposals to remember.", img: "https://images.unsplash.com/photo-1518049362265-d5b2a6467637?auto=format&fit=crop&w=600&q=80" },
      { id: "romantic",    name: "Romantic Date",       emoji: "🌹", blurb: "Private candle-lit date setups.", img: "https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=600&q=80" },
      { id: "oldage",      name: "Old Age Party",       emoji: "🌼", blurb: "Get-togethers honouring our elders.", img: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=600&q=80" },
      { id: "sendoff",     name: "Send-off / Farewell", emoji: "🎓", blurb: "Memorable farewells & send-offs.", img: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=600&q=80" },
      { id: "reunion",     name: "Reunion",             emoji: "🎉", blurb: "Friends & family get-togethers.", img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80" },
      { id: "movie",       name: "Just for Fun",        emoji: "🍿", blurb: "Private movie & binge sessions.", img: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80" },
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
        img: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=900&q=80",
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
        img: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=900&q=80",
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
      { title: "Theatre Birthday", theme: "g-rose",   tag: "birthday", img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=700&q=80" },
      { title: "Balloon Arch",     theme: "g-violet", tag: "birthday", img: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=700&q=80" },
      { title: "Floral Stage",     theme: "g-green",  tag: "wedding",  img: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=700&q=80" },
      { title: "Candle-lit Date",  theme: "g-amber",  tag: "romantic", img: "https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=700&q=80" },
      { title: "Naming Cradle",    theme: "g-teal",   tag: "naming",   img: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=700&q=80" },
      { title: "Wedding Mandap",   theme: "g-indigo", tag: "wedding",  img: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=700&q=80" },
      { title: "Anniversary Setup",theme: "g-rose",   tag: "romantic", img: "https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&w=700&q=80" },
      { title: "Baby Shower",      theme: "g-teal",   tag: "naming",   img: "https://images.unsplash.com/photo-1530891910412-92a4a0f7c3a1?auto=format&fit=crop&w=700&q=80" },
      { title: "Proposal Decor",   theme: "g-amber",  tag: "romantic", img: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=700&q=80" },
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

    /* ---- Food / catering packages (priced per guest) ---- */
    foodPackages: [
      { id: "none",    name: "No catering",      icon: "catering", veg: true,  perGuest: 0,   desc: "Skip food — bring your own or add later.", menu: [] },
      { id: "snacks",  name: "Snacks & Mocktails", icon: "catering", veg: true,  perGuest: 199, desc: "Assorted starters, mocktails & tea/coffee.", menu: ["2 starters", "Mocktail", "Tea / Coffee", "Cookies"] },
      { id: "vegthali", name: "Veg Silver Thali", icon: "catering", veg: true,  perGuest: 399, desc: "Wholesome vegetarian multi-course meal.", menu: ["3 starters", "2 mains", "Dal & rice", "2 breads", "Dessert", "Salad & papad"] },
      { id: "nonveg",  name: "Royal Non-Veg Feast", icon: "catering", veg: false, perGuest: 549, desc: "Premium non-veg spread with live counter.", menu: ["4 starters", "Chicken & mutton mains", "Biryani", "Breads", "Live counter", "2 desserts"] },
      { id: "premium", name: "Premium Buffet",    icon: "catering", veg: false, perGuest: 749, desc: "Grand multi-cuisine buffet, veg + non-veg.", menu: ["6 starters", "Multi-cuisine mains", "Biryani & rice", "Live counters", "Chaat & soup", "Dessert bar"] },
    ],

    /* ---- Cake customisation options (used by add-on cake) ---- */
    cakeOptions: {
      flavours: ["Chocolate", "Vanilla", "Butterscotch", "Red Velvet", "Pineapple", "Black Forest"],
      shapes: ["Round", "Square", "Heart", "Tier"],
      eggless: true,
    },

    /* ---- Decoration themes ---- */
    decorThemes: [
      { id: "royal",   name: "Royal Mysore",   theme: "g-green",  desc: "Regal green & gold with floral mandap." },
      { id: "pastel",  name: "Pastel Dream",   theme: "g-rose",   desc: "Soft pastels, balloons & fairy lights." },
      { id: "neon",    name: "Neon Night",     theme: "g-violet", desc: "LED, neon signage & club vibes." },
      { id: "floral",  name: "Floral Bliss",   theme: "g-teal",   desc: "Fresh flower walls & petal pathways." },
      { id: "boho",    name: "Boho Chic",      theme: "g-amber",  desc: "Earthy boho drapes, pampas & macramé." },
    ],

    /* ---- Video gallery (poster gradients; src optional/lazy) ---- */
    videos: [
      { id: "v1", title: "Theatre Surprise Reveal", duration: "0:48", theme: "g-rose",   tag: "birthday", views: "12.4k", img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=700&q=80" },
      { id: "v2", title: "Grand Hall Wedding Film",  duration: "1:32", theme: "g-indigo", tag: "wedding",  views: "28.1k", img: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=700&q=80" },
      { id: "v3", title: "Candle-lit Proposal",      duration: "0:36", theme: "g-amber",  tag: "romantic", views: "9.8k",  img: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=700&q=80" },
      { id: "v4", title: "Baby Shower Highlights",   duration: "0:54", theme: "g-teal",   tag: "naming",   views: "6.2k",  img: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=700&q=80" },
      { id: "v5", title: "360° Venue Walkthrough",   duration: "1:10", theme: "g-green",  tag: "venue",    views: "15.7k", img: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=700&q=80" },
      { id: "v6", title: "Anniversary Decor Setup",  duration: "0:41", theme: "g-violet", tag: "romantic", views: "7.5k",  img: "https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&w=700&q=80" },
    ],

    /* ---- Booking lifecycle milestones (event tracker) ---- */
    milestones: [
      { id: "requested", label: "Request received", icon: "calendar", note: "We got your booking request." },
      { id: "confirmed", label: "Advance paid & confirmed", icon: "shield", note: "Slot locked. Advance received." },
      { id: "planning",  label: "Planning & decor finalised", icon: "decor", note: "Theme, cake & add-ons confirmed." },
      { id: "ready",     label: "Setup ready", icon: "spark", note: "Venue decorated & ready for you." },
      { id: "completed", label: "Celebrated 🎉", icon: "heart", note: "Hope you made beautiful memories!" },
    ],

    /* ---- Vendors / staff (admin) ---- */
    vendors: [
      { id: "ven1", name: "Bloom & Petal Decor", role: "Decoration", phone: "9900112233", rating: 4.9, jobs: 412, status: "active" },
      { id: "ven2", name: "ClickCraft Studios",  role: "Photography", phone: "9900445566", rating: 4.8, jobs: 286, status: "active" },
      { id: "ven3", name: "Spice Route Catering", role: "Catering",   phone: "9900778899", rating: 4.7, jobs: 530, status: "active" },
      { id: "ven4", name: "GlowMax Lighting",     role: "Lighting & AV", phone: "9900221144", rating: 4.6, jobs: 198, status: "active" },
      { id: "ven5", name: "Sweet Tier Bakers",    role: "Cakes",      phone: "9900553366", rating: 4.9, jobs: 367, status: "onleave" },
    ],

    /* ---- Seed leads (admin CRM) — real enquiries get appended via STORE ---- */
    seedLeads: [
      { id: "L-1001", name: "Meera Iyer",   phone: "9845012345", occasion: "Birthday",     message: "Surprise theatre birthday for 8.", stage: "new",       createdAt: "2026-06-18T10:20:00Z" },
      { id: "L-1002", name: "Rahul Gupta",  phone: "9845067890", occasion: "Anniversary",  message: "Candle-lit dinner, 25th anniversary.", stage: "contacted", createdAt: "2026-06-17T14:05:00Z" },
      { id: "L-1003", name: "Fatima Khan",  phone: "9845054321", occasion: "Naming",       message: "Naming ceremony, ~120 guests, Grand Hall.", stage: "quoted", createdAt: "2026-06-16T09:40:00Z" },
    ],

    leadStages: [
      { id: "new",       label: "New" },
      { id: "contacted", label: "Contacted" },
      { id: "quoted",    label: "Quoted" },
      { id: "won",       label: "Won" },
      { id: "lost",      label: "Lost" },
    ],
  };
});
